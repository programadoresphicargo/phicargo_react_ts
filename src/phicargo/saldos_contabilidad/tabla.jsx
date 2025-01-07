import React, { useState, useEffect, useMemo } from 'react';
import Slide from '@mui/material/Slide';
import { Box } from '@mui/material';
import OperadorForm from './saldoForm';
import odooApi from '../modules/core/api/odoo-api';
import { DatePicker } from "@nextui-org/react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import Cuentas from './cuentas';
import SaldoForm from './saldoForm';

const Operadores = ({ estado }) => {
  const [id_cuenta, setCuenta] = React.useState(0);
  const [referencia, setReferencia] = React.useState(0);

  const fechaActual = new Date().toISOString().split('T')[0];
  const [value, setValue] = React.useState(parseDate(fechaActual));

  const valueMenosUnDia = new Date(value);
  valueMenosUnDia.setDate(valueMenosUnDia.getDate() - 1);
  const formattedValueMenosUnDia = valueMenosUnDia.toISOString().split('T')[0];

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
      const response = await odooApi.get('/saldos/fecha_actual/' + value);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
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
      },
      {
        accessorKey: 'referencia',
        header: 'Referencia',
      },
      {
        accessorKey: 'moneda',
        header: 'Moneda',
      },
      {
        accessorKey: 'saldo_anterior',
        header: 'Saldo anterior',
      },
      {
        accessorKey: 'saldo_actual',
        header: 'Saldo actual',
      },
      {
        accessorKey: 'id_saldo',
        header: 'Acción',
        Cell: ({ row }) => (
          <button
            onClick={() => abrirForm(row.original.id_cuenta, row.original.referencia)}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            <i class="bi bi-pen"></i>
          </button>)
      },
    ],
    [],
  );

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
    initialState: {
      density: 'compact',
      expanded: true,
      grouping: ['empresa', 'moneda'],
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
        backgroundColor: row.subRows?.length ? '#1184e8' : '#FFFFFF',
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
        color: row.subRows?.length ? '#FFFFFF' : '#000000',
      },
    }),
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 200px)',
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

            <h1 className='text-primary'>Reporte de saldos</h1>
            <DatePicker
              className="max-w-[284px]"
              label="Fecha"
              value={value}
              onChange={setValue}
            />
            <Button color='primary' onClick={handleClickOpen}>Cuentas</Button>
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
          <SaldoForm id_cuenta={id_cuenta} referencia={referencia} onClose={handleClose}></SaldoForm>
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
