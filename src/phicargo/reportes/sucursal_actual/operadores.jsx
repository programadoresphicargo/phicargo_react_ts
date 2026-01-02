import { Button, Chip } from "@heroui/react";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import OperadoresDialogPage from "./historial";

const SucursalActualOperador = () => {

  const [open, setOpen] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {

      setisLoading(true);
      const response = await odooApi.get(`/tms_travel/sucursal_actual_operadores/`);
      setData(response.data);
    } catch (error) {
      toast.error('Error al enviar los datos: ' + error);
    } finally {
      setisLoading(false);
    }
  };


  const columns = [
    { accessorKey: 'operador', header: 'Operador', },
    {
      accessorKey: 'sucursal', header: 'Última sucursal', Cell: ({ cell }) => {
        const valor = cell.getValue() || '';
        var clase;

        if (valor === 'Manzanillo (Sucursal)') {
          clase = 'danger';
        } else if (valor === 'Veracruz (Matriz)') {
          clase = 'success';
        } else {
          clase = 'primary';
        }

        return (
          <Chip color={clase} size="sm" className="text-white">
            {valor}
          </Chip>
        );
      },
    },
    { accessorKey: 'dias_en_sucursal', header: 'Días en sucursal' },
    { accessorKey: 'fecha_inicio_acumulada', header: 'Desde' },
    { accessorKey: 'vehicles_usados', header: 'Vehiculos usados' },
  ];

  const table = useMaterialReactTable({
    columns,
    data,
    state: { showProgressBars: isLoading },
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    localization: MRT_Localization_ES,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      expanded: false,
      pagination: { pageSize: 80 },
      showColumnFilters: true,
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
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
        backgroundColor: row.subRows?.length ? '#0456cf' : '#FFFFFF',
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '12px',
        color: row.subRows?.length ? '#FFFFFF' : '#000000',
      },
    }),
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        setOpen(true);
        setHistorial(row.original.historial);
      },
      style: {
        cursor: 'pointer',
      },
    }),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'nowrap',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >

        <h1
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Operadores
        </h1>
        <Button color="success" onPress={() => fetchData()} className="text-white" radius="full">Recargar</Button>

      </Box >
    ),
  })

  return (
    <>
      <MaterialReactTable
        table={table}
      />
      <OperadoresDialogPage open={open} setOpen={setOpen} data={historial}></OperadoresDialogPage>
    </>
  );
};

export default SucursalActualOperador;
