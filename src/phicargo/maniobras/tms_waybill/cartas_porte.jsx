import { Button, Chip, Select, SelectItem } from "@heroui/react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Example2 from '../maniobras/modal';
import { ManiobraProvider } from '../context/viajeContext';
import ManiobrasNavBar from '../Navbar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { ThemeProvider } from '@mui/material/styles';
import customFontTheme from '../../../theme';
import { exportToCSV } from '../../utils/export';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { DateRangePicker } from 'rsuite';
import { MRT_Localization_ES } from 'material-react-table/locales/es';

const CartasPorte = () => {

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [range, setRange] = useState([firstDay, lastDay]);

  const [isLoading2, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = React.useState("carta");

  const handleTabChange = (e) => {
    const newTab = e.target.value;
    setSelectedTab(newTab);
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await odooApi.get('/tms_waybill/get_contenedores/',
        {
          params: {
            date_start: range[0].toISOString().slice(0, 10),
            date_end: range[1].toISOString().slice(0, 10),
            tab: selectedTab
          }
        });
      setData(response.data);
    } catch (error) {
      toast.error('Error al obtener los datos:' + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range, selectedTab]);

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

          const mappings = {
            sm: { variant: 'secondary', text: 'SIN MANIOBRA' },
            EI: { variant: 'warning', text: 'EN PROCESO DE INGRESO' },
            pm: { variant: 'primary', text: 'PATIO MÉXICO' },
            Ing: { variant: 'success', text: 'INGRESADO' },
            'No Ing': { variant: 'danger', text: 'NO INGRESADO' },
            ru: { variant: 'info', text: 'REUTILIZADO' },
            can: { variant: 'error', text: 'CANCELADO' },
            P: { variant: 'primary', text: 'EN PATIO' },
            T: { variant: 'warning', text: 'EN TERRAPORTS' },
            V: { variant: 'success', text: 'EN VIAJE' },
          };

          if (mappings[value]) {
            variant = mappings[value].variant;
            text = mappings[value].text;
          } else {
            variant = 'danger';
            text = value || 'DESCONOCIDO';
          }

          return (
            value !== null ? (
              <Chip color={variant} size='sm' className="text-white">
                {text}
              </Chip>) : null
          );
        },
      },
      {
        accessorKey: 'estado_eir',
        header: 'EIR',
        size: 150,
      },
      {
        accessorKey: 'x_ejecutivo_viaje_bel',
        header: 'Ejecutivo',
        size: 150,
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableColumnPinning: true,
    enableStickyHeader: true,
    localization: MRT_Localization_ES,
    positionToolbarAlertBanner: 'none',
    positionGlobalFilter: "right",
    muiSearchTextFieldProps: {
      placeholder: `Buscador global`,
      sx: { minWidth: '300px' },
      variant: 'outlined',
    },
    initialState: {
      showColumnFilters: true,
      density: 'compact',
      pagination: { pageSize: 80 },
      showGlobalFilter: false,
    },
    state: { showProgressBars: isLoading2 },
    muiCircularProgressProps: {
      color: 'primary',
      thickness: 5,
      size: 45,
    },
    muiSkeletonProps: {
      animation: 'pulse',
      height: 28,
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
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
        maxHeight: 'calc(100vh - 230px)',
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
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          alignItems: 'center',
        }}
      >
        <h1
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Contenedores
        </h1>
        <DateRangePicker
          style={{ minWidth: "250px" }}
          value={range}
          onChange={(value) => setRange(value)}
          placeholder="Selecciona un rango de fechas"
          format="yyyy-MM-dd"
        />
        <Select
          style={{ minWidth: "300px" }}
          onChange={handleTabChange}
          label="Seleccionar una opción"
          size={'sm'} variant='bordered'
          selectedKeys={[selectedTab]}
          fullWidth={true}>
          <SelectItem key={'carta'}>Cartas porte</SelectItem>
          <SelectItem key={'solicitud'}>Solicitudes de transporte</SelectItem>
        </Select>
        <Button
          color='success'
          fullWidth
          className='text-white'
          startContent={<i class="bi bi-file-earmark-excel"></i>}
          onPress={() => exportToCSV(data, columns, "contenedores.csv")}
        >Exportar
        </Button>
      </Box>
    ),
  });

  return (
    <div>
      <ManiobraProvider>
        <ManiobrasNavBar />
        <MaterialReactTable key={selectedTab} table={table} />
        <Example2
          show={modalShow}
          handleClose={handleCloseModal}
          id_cp={modalContent}
          x_reference={x_reference}
          id_cliente={partner_id} />
      </ManiobraProvider>
    </div >
  );
};

export default CartasPorte;
