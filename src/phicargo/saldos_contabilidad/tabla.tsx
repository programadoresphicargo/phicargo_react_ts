import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import {
  MRT_Cell,
  MRT_Column,
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDate, parseDate } from "@internationalized/date";
import { Box } from '@mui/material';
import { Chip } from "@heroui/react";
import { DatePicker } from "@heroui/react";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import SaldoForm from './saldo_form';
import odooApi from '@/api/odoo-api';

type Saldo = {
  id_cuenta: number;
  id_saldo: number;
  empresa: string;
  banco: string;
  referencia: string;
  tipo: string;
  moneda: string;
  saldo_anterior: number;
  saldo_actual: number;
  variacion: number;
}

const SaldosTable = () => {

  const [id_cuenta, setCuenta] = React.useState<number | null>(null);
  const [referencia, setReferencia] = React.useState<string>("");

  const [fechaAnterior, setFechaAnterior] = useState('');
  const fechaActual = new Date().toISOString().split('T')[0];
  const [value, setValue] = React.useState<CalendarDate | null>(
    parseDate(fechaActual)
  );

  const [open2, setOpen2] = React.useState(false);

  const abrirForm = (id_cuenta: number, referencia: string) => {
    setOpen2(true);
    setCuenta(id_cuenta);
    setReferencia(referencia);
  };

  const handleClose2 = () => {
    setOpen2(false);
    fetchData();
  };

  const [data, setData] = useState<Saldo[]>([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get(`/saldos/fecha_actual/${value}`);
      if (response.data.length > 0) {
        setFechaAnterior(String(response.data[0].fecha_anterior || ''));
      } else {
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

  const columns = useMemo<MRT_ColumnDef<Saldo>[]>(
    () => [
      {
        accessorKey: 'empresa',
        header: 'Empresa',
      },
      {
        accessorKey: 'banco',
        header: 'Banco',
        Cell: ({ cell }: { cell: MRT_Cell<Saldo> }) => {
          const referencia = cell.getValue<string>() || '';
          return (
            <Chip color='primary' size="sm">
              {referencia}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'referencia',
        header: 'Referencia',
        Cell: ({ cell }: { cell: MRT_Cell<Saldo> }) => {
          const referencia = cell.getValue<string>() || '';
          return (
            <Chip color='success' className='text-white' size="sm">
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
        header: 'Saldo anterior',
        muiTableBodyCellProps: {
          align: 'right',
        },
        Footer: ({
          column,
          table,
        }: {
          column: MRT_Column<Saldo>;
          table: MRT_TableInstance<Saldo>;
        }) => {
          const totalGlobal = table
            .getFilteredRowModel()
            .rows.reduce((sum, row) => {
              const value = row.getValue<number>(column.id) || 0;
              return sum + value;
            }, 0);

          if (totalGlobal === 0) return '';

          const formattedTotal = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(totalGlobal);

          return `Total Global: ${formattedTotal}`;
        },
        AggregatedCell: ({
          column,
          row,
        }: {
          column: MRT_Column<Saldo>;
          row: MRT_Row<Saldo>;
        }) => {
          const groupTotal = (row.subRows ?? []).reduce((sum, subRow) => {
            const value = subRow.getValue<number>(column.id) || 0;
            return sum + value;
          }, 0);

          if (groupTotal === 0) return '';

          const formattedTotal = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(groupTotal);

          return `Total: ${formattedTotal}`;
        },
        Cell: ({ cell }: { cell: MRT_Cell<Saldo> }) => {
          const value = cell.getValue<number>() || 0;

          return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
        },
      },
      {
        accessorKey: 'saldo_actual',
        header: `Saldo actual: ${value?.year}-${value?.month}-${value?.day}`,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Footer: ({
          column,
          table,
        }: {
          column: MRT_Column<Saldo>;
          table: MRT_TableInstance<Saldo>;
        }) => {
          const totalGlobal = table
            .getFilteredRowModel()
            .rows.reduce((sum, row) => {
              const value = row.getValue<number>(column.id) || 0;
              return sum + value;
            }, 0);

          if (totalGlobal === 0) return '';

          const formattedTotal = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(totalGlobal);

          return `Total Global: ${formattedTotal}`;
        },
        AggregatedCell: ({
          column,
          row,
        }: {
          column: MRT_Column<Saldo>;
          row: MRT_Row<Saldo>;
        }) => {
          const groupTotal = (row.subRows ?? []).reduce((sum, subRow) => {
            const value = subRow.getValue<number>(column.id) || 0;
            return sum + value;
          }, 0);

          if (groupTotal === 0) return '';

          const formattedTotal = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(groupTotal);

          return `Total: ${formattedTotal}`;
        },
        Cell: ({ cell }: { cell: MRT_Cell<Saldo> }) => {
          const value = cell.getValue<number>() || 0;

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
        Cell: ({ row }: { row: MRT_Row<Saldo> }) => (
          <Button
            size='sm'
            color='success'
            className='text-white'
            radius="full"
            onPress={() => abrirForm(row.original.id_cuenta, row.original.referencia)}
          >
            <i className="bi bi-pen"></i>
          </Button>
        ),
      }
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
    groupedColumnMode: "remove",
    state: { showProgressBars: isLoading },
    positionToolbarAlertBanner: "bottom",
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
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
      onClick: () => {
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
        backgroundColor: row.getCanExpand() ? '#0456cf' : '#FFFFFF',
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
        color: row.getCanExpand() ? '#FFFFFF' : '#000000',
      },
    }),
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 235px)',
      },
    },
    renderTopToolbarCustomActions: () => (
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
          </div>
        </div>

      </Box>
    ),
  });

  return (
    <>
      <Modal
        size="2xl"
        isOpen={open2}
        onOpenChange={handleClose2}
      >
        <ModalContent>
          <ModalHeader>
            Registro de saldo
          </ModalHeader>
          <ModalBody>
            {id_cuenta && (
              <SaldoForm id_cuenta={id_cuenta} referencia={referencia} onClose={handleClose2}></SaldoForm>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      <MaterialReactTable table={table} />
    </>
  );

};

export default SaldosTable;
