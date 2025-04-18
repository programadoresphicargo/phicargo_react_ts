import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { getLocalTimeZone, parseDate } from "@internationalized/date";

import { Box } from '@mui/material';
import { Chip } from "@heroui/react";
import Cuentas from './cuentas';
import { DatePicker } from "@heroui/react";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import OperadorForm from './saldoForm';
import SaldoForm from './saldoForm';
import Slide from '@mui/material/Slide';
import odooApi from '@/api/odoo-api';

const Operadores = ({ estado }) => {

  const [id_cuenta, setCuenta] = React.useState(0);
  const [referencia, setReferencia] = React.useState(0);

  const [fechaAnterior, setFechaAnterior] = useState('');
  const fechaActual = new Date().toISOString().split('T')[0];
  const [value, setValue] = React.useState(parseDate(fechaActual));

  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const [id_operador, setIDOperador] = useState(0);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const abrirForm = (id_cuenta, referencia) => {
    setOpen2(true);
    setCuenta(id_cuenta);
    setReferencia(referencia);
  };

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const handleClose2 = () => {
    setOpen2(false);
    fetchData();
  };

  const [data, setData] = useState([]);
  const [isLoading2, setLoading] = useState();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get(`/saldos/fecha_actual/${value}`);

      if (response.data.length > 0) {
        setFechaAnterior(String(response.data[0].fecha_anterior || ''));
      } else {
        console.warn("No hay datos en la respuesta.");
        setFechaAnterior('');
      }

      setData(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [value]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'empresa',
        header: 'Empresa',
      },
      {
        accessorKey: 'banco',
        header: 'Banco',
        Cell: ({ cell }) => {
          const referencia = cell.getValue() || '';
          return (
            <Chip color='primary'>
              {referencia}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'referencia',
        header: 'Referencia',
        Cell: ({ cell }) => {
          const referencia = cell.getValue() || '';
          return (
            <Chip color='success' className='text-white'>
              {referencia}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'tipo',
        header: 'Tipo',
      },
      {
        accessorKey: 'moneda',
        header: 'Moneda',
      },
      {
        accessorKey: 'saldo_anterior',
        header: `Saldo anterior`,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Footer: ({ column, table }) => {
          const totalGlobal = table
            .getFilteredRowModel()
            .rows.reduce((sum, row) => {
              const value = row.getValue(column.id) || '0';
              const numericValue = parseFloat(value.replace(/,/g, ''));
              return sum + (isNaN(numericValue) ? 0 : numericValue);
            }, 0);

          if (totalGlobal === 0) return '';

          const formattedTotal = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(totalGlobal);

          return `Total Global: ${formattedTotal}`;
        },
        AggregatedCell: ({ column, row }) => {
          const groupTotal = row
            .subRows.reduce((sum, subRow) => {
              let value = subRow.getValue(column.id) || '0';

              if (typeof value !== 'string') {
                value = String(value);
              }

              const numericValue = parseFloat(value.replace(/,/g, ''));
              return sum + (isNaN(numericValue) ? 0 : numericValue);
            }, 0);

          if (groupTotal === 0) return '';

          const formattedTotal = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(groupTotal);

          return `Total: ${formattedTotal}`;
        },
        Cell: ({ cell }) => {
          const value = parseFloat((cell.getValue() || '0').replace(/,/g, ''));

          return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
        },
      },
      {
        accessorKey: 'saldo_actual',
        header: 'Saldo actual: ' + `${value.year}-${value.month}-${value.day}`,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Footer: ({ column, table }) => {
          const totalGlobal = table
            .getFilteredRowModel()
            .rows.reduce((sum, row) => {
              const value = row.getValue(column.id) || '0';
              const numericValue = parseFloat(value.replace(/,/g, ''));
              return sum + (isNaN(numericValue) ? 0 : numericValue);
            }, 0);

          if (totalGlobal === 0) return '';

          const formattedTotal = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(totalGlobal);

          return `Total Global: ${formattedTotal}`;
        },
        AggregatedCell: ({ column, row }) => {
          const groupTotal = row
            .subRows.reduce((sum, subRow) => {
              let value = subRow.getValue(column.id) || '0';

              if (typeof value !== 'string') {
                value = String(value);
              }

              const numericValue = parseFloat(value.replace(/,/g, ''));
              return sum + (isNaN(numericValue) ? 0 : numericValue);
            }, 0);

          if (groupTotal === 0) return '';

          const formattedTotal = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(groupTotal);

          return `Total: ${formattedTotal}`;
        },
        Cell: ({ cell }) => {
          const value = parseFloat((cell.getValue() || '0').replace(/,/g, ''));

          return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
        },
      },
      {
        accessorKey: 'variacion',
        header: 'Variación',
        muiTableBodyCellProps: {
          align: 'right',
        },
      },
      {
        accessorKey: 'id_saldo',
        header: 'Acción',
        Cell: ({ row }) => (
          <Button
            size='sm'
            color='success'
            className='text-white'
            onPress={() => abrirForm(row.original.id_cuenta, row.original.referencia)}
          >
            <i class="bi bi-pen"></i>
          </Button>)
      },
    ],
    [fechaActual, value]
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    localization: MRT_Localization_ES,
    state: { showProgressBars: isLoading2 },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      expanded: false,
      grouping: ['empresa', 'tipo', 'moneda'],
      pagination: { pageIndex: 0, pageSize: 100 },
      showColumnFilters: true,
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: ({ event }) => {
        if (row.subRows?.length) {
        } else {
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
        backgroundColor: row.subRows?.length ? '#0456cf' : '#FFFFFF',
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
        color: row.subRows?.length ? '#FFFFFF' : '#000000',
      },
    }),
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 290px)',
      },
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">

            <h1
              className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
            >
              Reporte de saldos
            </h1>

            <DatePicker
              className="max-w-[284px]"
              label="Fecha"
              value={value}
              onChange={setValue}
            />

            <h1 className='text-primary'>Fecha saldo anterior: {fechaAnterior || 'N/A'}</h1>

            <Button color='primary' onPress={handleClickOpen}>Cuentas</Button>
          </div>
        </div>

      </Box>
    ),
  });

  return (<>

    <Modal
      size='5xl'
      isOpen={open}
      onOpenChange={handleClose}
    >
      <ModalContent>
        <ModalBody>
          <Cuentas></Cuentas>
        </ModalBody>
      </ModalContent>
    </Modal>

    <Modal
      size='xl'
      isOpen={open2}
      onOpenChange={handleClose2}
    >
      <ModalContent>
        <ModalHeader>
          Registro de saldo
        </ModalHeader>
        <ModalBody>
          <SaldoForm id_cuenta={id_cuenta} referencia={referencia} onClose={handleClose2}></SaldoForm>
        </ModalBody>
      </ModalContent>
    </Modal>

    <div>
      <MaterialReactTable table={table} />
    </div >
  </>
  );

};

export default Operadores;
