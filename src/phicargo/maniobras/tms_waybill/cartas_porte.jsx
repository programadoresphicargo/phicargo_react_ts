import React, { useState, useEffect, useMemo } from 'react';
import MonthSelector from '../../../mes';
import Example2 from '../maniobras/modal';
import { ThemeProvider } from '@mui/material/styles';
import customFontTheme from '../../../theme';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
const { VITE_PHIDES_API_URL } = import.meta.env;
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import ManiobrasNavBar from '../Navbar';
import { Button, Select, SelectItem } from '@nextui-org/react';
import YearSelector from '@/año';

const CartasPorte = () => {
  const [isLoading2, setLoading] = useState();
  const [selectedTab, setSelectedTab] = useState('carta');

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    fetchData(selectedMonth, newValue);
  };

  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const handleChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const [modalShow, setModalShow] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [x_reference, setXreferenceContent] = useState('');
  const [partner_id, setPartenerid] = useState('');

  const handleShowModal = (id_cp, x_reference, partner_id) => {
    setModalContent(id_cp);
    setXreferenceContent(x_reference);
    setModalShow(true);
    setPartenerid(partner_id);
  };

  const handleCloseModal = () => setModalShow(false);

  const [data, setData] = useState([]);

  const currentYear = new Date().getFullYear(); 
  const [selectedYear, setSelectedYear] = useState([currentYear]); 

  const handleChangeYear = (event) => {
    setSelectedYear(event.target.value); 
  };

  const fetchData = async (month, year, selectedTab) => {
    if (!month || selectedTab === undefined) return;
    setLoading(true);
    try {
      const response = await fetch(VITE_PHIDES_API_URL + '/modulo_maniobras/programacion/get_registros.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ month, year, selectedTab }),
      });

      const jsonData = await response.json();
      console.log('Datos recibidos:', jsonData);
      setData(jsonData);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    } finally {
      setLoading(false); // Mueve esto aquí
    }
  };

  useEffect(() => {
    fetchData(selectedMonth, selectedYear, selectedTab);
  }, [selectedMonth, selectedYear, selectedTab]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'empresa',
        header: 'Empresa',
      },
      {
        accessorKey: 'sucursal',
        header: 'Sucursal',
      },
      {
        accessorKey: 'date_order',
        header: 'Fecha',
      },
      {
        accessorKey: 'carta_porte',
        header: 'Carta porte',
      },
      {
        accessorKey: 'cliente',
        header: 'Cliente',
      },
      {
        accessorKey: 'x_ejecutivo_viaje_bel',
        header: 'Ejecutivo de viaje',
        size: 150,
      },
      {
        accessorKey: 'x_reference',
        header: 'Contenedor',
        size: 150,
      },
      {
        accessorKey: 'x_status_bel',
        header: 'Estatus',
        size: 150,
        Cell: ({ cell }) => {
          const value = cell.getValue();

          let variant = 'secondary';
          let text = '';
          if (value === 'Ing') {
            variant = 'success';
            text = 'Ingresado';
          } else if (value === 'P') {
            variant = 'primary';
            text = 'Patio';
          } else if (value === 'local') {
            variant = 'danger';
            text = 'Local';
          } else {
            variant = 'danger';
            text = value;
          }

          return (
            <span className={`badge bg-${variant} rounded-pill`} style={{ width: '100px' }}>
              {text}
            </span>
          );
        },
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: false,
    enableFilters: true,
    initialState: {
      showColumnFilters: true,
      grouping: ['sucursal'],
      density: 'compact',
      pagination: { pageSize: 80 },
      showGlobalFilter: false,
    },
    state: { isLoading: isLoading2 },
    muiCircularProgressProps: {
      color: 'primary',
      thickness: 5,
      size: 45,
    },
    muiSkeletonProps: {
      animation: 'pulse',
      height: 28,
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        if (row.subRows?.length) {
        } else {
          handleShowModal(row.original.id_cp, row.original.x_reference, row.original.id_cliente);
        }
      },
      style: {
        cursor: 'pointer',
      },
    }),
    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '14px',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 285px)',
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row.subRows?.length ? '#1184e8' : '#FFFFFF',
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
        color: row.subRows?.length ? '#FFFFFF' : '#000000',
      },
    }),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box display="flex" alignItems="center" m={2}>
        <Box sx={{ flexGrow: 1, mr: 2 }}>
          <MonthSelector
            selectedMonth={selectedMonth}
            handleChange={handleChange}
          />
        </Box>
        <Box sx={{ flexGrow: 1, mr: 2 }}>
          <YearSelector selectedYear={selectedYear} handleChange={handleChangeYear}></YearSelector>
        </Box>
      </Box>
    ),
  });

  return (
    <div>
      <ManiobrasNavBar />
      <Box display="flex" alignItems="center" m={2}>
        <Box sx={{ flexGrow: 1, mr: 2 }}>
          <Tabs value={selectedTab} onChange={handleTabChange} aria-label="Tabs">
            <Tab value="carta" label="Carta porte" />
            <Tab value="solicitud" label="Solicitudes de transporte" />
          </Tabs>
        </Box>
      </Box>
      <Example2
        show={modalShow}
        handleClose={handleCloseModal}
        id_cp={modalContent}
        x_reference={x_reference}
        id_cliente={partner_id} />
      <ThemeProvider theme={customFontTheme}>
        <MaterialReactTable key={selectedTab} table={table} />
      </ThemeProvider>
    </div >
  );
};

export default CartasPorte;
