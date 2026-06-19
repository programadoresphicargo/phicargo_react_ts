import {
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { Avatar, AvatarGroup } from "@heroui/react";
import { Box } from '@mui/material';
import { Button } from "@heroui/react";
import odooApi from '@/api/odoo-api';
import MinutaForm from './form';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Tooltip } from "@heroui/react";
import { Dayjs } from 'dayjs';

export type Responsables = {
  id_empleado: number;
  empleado: string;
  puesto: string;
};

export type Tarea = {
  id_tarea: number;
  descripcion: string;
  responsables: Responsables[];
  fecha_compromiso: string | null;
};

export type Participante = {
  id_empleado: number;
  empleado: string;
  puesto: string;
};

export type Minuta = {
  id_minuta: number | null;
  id_solicitante: number | null;
  fecha: Dayjs;
  estado: string;
  puntos_discusion: string;
  participantes: Participante[];
  tareas: Tarea[];
  desarrollo_reunion: string;
}

const Minutas = ({ }) => {

  const [open, setOpen] = React.useState(false);
  const [id_minuta, setMinuta] = React.useState<number | null>(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMinuta(null);
  };

  const [data, setData] = useState<Minuta[]>([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/minutas/');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [open]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id_minuta',
        header: 'ID Minuta',
      },
      {
        accessorKey: 'fecha',
        header: 'Fecha',
      },
      {
        accessorKey: 'solicitante',
        header: 'Solicitante',
      },
      {
        accessorKey: 'departamento',
        header: 'Departamento',
      },
      {
        accessorKey: 'puesto',
        header: 'Puesto',
      },
      {
        accessorKey: 'puntos_discusion',
        header: 'Puntos a discusión',
        Cell: ({ row }: { row: MRT_Row<Minuta> }) => {
          const texto = row.original.puntos_discusion || '';
          const palabras = texto.split(' ');

          const textoRecortado =
            palabras.length > 30
              ? palabras.slice(0, 30).join(' ') + '...'
              : texto;

          return <div style={{ whiteSpace: 'pre-line' }}>{textoRecortado}</div>;
        },
      },
      {
        accessorKey: 'participantes',
        header: 'Participantes',
        Cell: ({ row }: { row: MRT_Row<Minuta> }) => {

          const colors = [
            "default",
            "primary",
            "secondary",
            "success",
            "warning",
            "danger",
          ] as const;

          const participantes = row.original.participantes;

          return (
            <AvatarGroup isBordered>
              {participantes && participantes.length > 0 ? (
                participantes.map((p: Participante, index: number) => (
                  <Tooltip
                    key={index}
                    content={p.empleado}
                    color="primary"
                  >
                    <Avatar
                      isBordered
                      color={colors[index % colors.length]}
                      size="sm"
                    />
                  </Tooltip>
                ))
              ) : (
                "Sin responsables"
              )}
            </AvatarGroup>
          );
        },
      },
      {
        accessorKey: 'usuario_registro_nombre',
        header: 'Usuario registro',
      },
      {
        accessorKey: 'fecha_registro',
        header: 'Fecha registro',
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    localization: MRT_Localization_ES,
    enableFilters: true,
    state: { showProgressBars: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 80 },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        handleClickOpen();
        setMinuta(row.original.id_minuta);
      },
      style: {
        cursor: 'pointer',
      },
    }),
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
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <h1 className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text">
          Minutas
        </h1>
        <MinutaForm open={open} handleClose={handleClose} id_minuta={id_minuta}></MinutaForm>
        <Button color='primary' className='text-white' onPress={() => handleClickOpen()} radius='full'><i className="bi bi-plus-circle"></i> Nuevo</Button>
        <Button color='success' className='text-white' onPress={() => fetchData()} radius='full'><i className="bi bi-arrow-clockwise"></i> Refrescar</Button>
      </Box>
    ),
  });

  return (<>
    <MaterialReactTable table={table} />
  </>
  );

};

export default Minutas;
