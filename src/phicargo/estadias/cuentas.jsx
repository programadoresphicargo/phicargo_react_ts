import React, { useState, useEffect, useMemo } from 'react';
import Slide from '@mui/material/Slide';
import { Box } from '@mui/material';
import OperadorForm from './saldoForm';
import odooApi from '../modules/core/api/odoo-api';
import { DatePicker, Chip } from "@heroui/react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import CuentaForm from './costos_extras';

const Cuentas = ({ estado }) => {

  const fechaActual = new Date().toISOString().split('T')[0];
  const [value, setValue] = React.useState(parseDate(fechaActual));

  const [open, setOpen] = React.useState(false);
  const [id_cuenta, setCuenta] = useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const [data, setData] = useState([]);
  const [isLoading2, setLoading] = useState();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/cuentas/get_cuentas/');
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
        accessorKey: 'id_cuenta',
        header: 'Cuenta',
      },
      {
        accessorKey: 'banco',
        header: 'Banco',
        Cell: ({ cell }) => {
          const referencia = cell.getValue() || '';
          return (
            <Chip color='primary' className='text-white'>
              {referencia}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'referencia',
        header: 'Referencia',
      },
      {
        accessorKey: 'tipo',
        header: 'Tipo',
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
        accessorKey: 'moneda',
        header: 'Moneda',
      },
      {
        accessorKey: 'fecha_creacion',
        header: 'Fecha creacion',
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
          handleClickOpen();
          setCuenta(row.original.id_cuenta);
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

            <h1 className='text-primary'>Cuentas registradas</h1>
            <Button color='primary' onClick={handleClickOpen}>Nueva cuenta</Button>
          </div>
        </div>

      </Box>
    ),
  });

  return (<>

    <Modal
      isOpen={open}
      onOpenChange={handleClose}
    >
      <ModalContent>
        <ModalHeader>
          Nueva cuenta
        </ModalHeader>
        <ModalBody>
          <CuentaForm id_cuenta={id_cuenta} onClose={handleClose}></CuentaForm>
        </ModalBody>
      </ModalContent>
    </Modal>

    <div>
      <MaterialReactTable table={table} />
    </div >
  </>
  );

};

export default Cuentas;
