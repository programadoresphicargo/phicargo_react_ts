import React, { useState, useEffect, useMemo } from 'react';
import Formulariomaniobra from '../maniobras/formulario_maniobra';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Box } from '@mui/material';
import { Chip } from '@nextui-org/react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { DateRangePicker } from 'rsuite';
import odooApi from '@/phicargo/modules/core/api/odoo-api';

const Maniobras = ({ estado_maniobra }) => {

  const [dateRange, setDateRange] = useState(null);
  const [data, setData] = useState([]);

  const [isLoading2, setLoading] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [id_maniobra, setIdmaniobra] = useState('');
  const [id_cp, setIdcp] = useState('');
  const [idCliente, setClienteID] = useState('');

  const handleShowModal = (id_maniobra, id_cp) => {
    setModalShow(true);
    setIdmaniobra(id_maniobra);
    setIdcp(id_cp);
  };

  const handleCloseModal = () => {
    setModalShow(false);
    fetchData();
  };


  const fetchData = async () => {
    console.log(dateRange[0]);
    try {
      setLoading(true);
      const response = await odooApi.get(`/tms_waybill/get_by_date_range/${dateRange[0].toISOString().split('T')[0]}/${dateRange[1].toISOString().split('T')[0]}`);
      console.log(response.data);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'date_order',
        header: 'Fecha',
      },
      {
        accessorKey: 'name',
        header: 'Carta porte',
      },
      {
        accessorKey: 'x_reference',
        header: 'Referencia',
      },
      {
        accessorKey: 'x_medida_bel',
        header: 'Medida',
      },
      {
        accessorKey: 'x_ejecutivo_viaje_bel',
        header: 'Ejecutivo',
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
    ],
    [],
  );

  const manualGrouping = ['nombre_operador'];

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { isLoading: isLoading2 },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    grouping: manualGrouping,
    initialState: {
      density: 'compact',
      showColumnFilters: true,
      pagination: { pageSize: 80 },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 200px)',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: ({ event }) => {

        if (row.subRows?.length) {
        } else {
          handleShowModal(row.original.id_maniobra, row.original.id);
          setClienteID(row.original.id_cliente);
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
    muiTableBodyCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
      },
    },

    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          alignItems: 'center',
        }}
      >
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          format="yyyy-MM-dd"
          placeholder="Selecciona un rango"
          size="md">
        </DateRangePicker>
      </Box >
    ),
  });

  return (
    <div>
      <Formulariomaniobra
        show={modalShow}
        handleClose={handleCloseModal}
        id_maniobra={id_maniobra}
        id_cp={id_cp}
        id_cliente={idCliente}
        form_deshabilitado={true}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="table-striped">
          <MaterialReactTable table={table} />
        </div>
      </LocalizationProvider>
    </div >
  );

};

export default Maniobras;
