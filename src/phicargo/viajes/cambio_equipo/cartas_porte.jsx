import React, { useState, useEffect, useMemo } from 'react';
import MonthSelector from '../../../mes';
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

const ContenedoresCambio = ({ setSelectedItems, onClose }) => {

  const handleRowClick = (id, contenedor) => {
    const newItem = { id_cp: id, contenedor: contenedor };
    setSelectedItems((prevItems) => {
      const exists = prevItems.some((item) => item.id === id);
      if (!exists) {
        return [...prevItems, newItem];
      }
      return prevItems;
    });
    onClose();
  };

  const [selectedTab, setSelectedTab] = useState('carta');

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    fetchData(selectedMonth, newValue);
  };

  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [isLoading2, setLoading] = useState();

  const handleChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const [data, setData] = useState([]);

  const fetchData = async (month, selectedTab) => {
    if (!month || selectedTab === undefined) return;
    setLoading(true);
    try {
      const response = await fetch(VITE_PHIDES_API_URL + '/modulo_maniobras/programacion/get_registros.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ month, selectedTab }), // Enviamos month y selectedTab
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
    fetchData(selectedMonth, selectedTab);
  }, [selectedMonth, selectedTab]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'store_id',
        header: 'Sucursal',
        Cell: ({ cell }) => {
          const partnerData = cell.getValue();
          return partnerData[1];
        }
      },
      {
        accessorKey: 'date_order',
        header: 'Fecha',
        size: 150,
      },
      {
        accessorKey: 'name',
        header: 'Carta porte',
      },
      {
        accessorKey: 'partner_id',
        header: 'Cliente',
        Cell: ({ cell }) => {
          const partnerData = cell.getValue();
          return partnerData[1];
        }
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
      grouping: ['store_id'],
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
        if (!row.subRows?.length) {
          handleRowClick(row.original.id, row.original.x_reference);
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
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row.subRows?.length ? '#1184e8' : '#FFFFFF',
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
        color: row.subRows?.length ? '#FFFFFF' : '#000000',
      },
    }),
  });

  return (
    <div>
      <Box display="flex" alignItems="center" m={2}>
        <Box sx={{ flexGrow: 1, mr: 2 }}>
          <MonthSelector
            selectedMonth={selectedMonth}
            handleChange={handleChange}
          />
        </Box>
        <Box sx={{ flexGrow: 1, mr: 2 }}>
          <Tabs value={selectedTab} onChange={handleTabChange} aria-label="Tabs">
            <Tab value="carta" label="Carta porte" />
            <Tab value="solicitud" label="Solicitudes de transporte" />
          </Tabs>
        </Box>
      </Box>
      <ThemeProvider theme={customFontTheme}>
        <MaterialReactTable key={selectedTab} table={table} />
      </ThemeProvider>
    </div >
  );
};

export default ContenedoresCambio;
