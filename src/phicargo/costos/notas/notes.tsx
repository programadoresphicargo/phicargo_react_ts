import { Button } from "@heroui/react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import odooApi from '@/api/odoo-api';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import TravelNoteDetail from "./dialog";
import React from "react";
import CustomNavbar from "@/pages/CustomNavbar";
import { pages } from '../folios/pages';

type TravelNotes = {
  id: number;
  note: string;
};

const TravelNotes = () => {

  const [data, setData] = useState<TravelNotes[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [NoteId, setNoteID] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/notes/costos_extras/');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorKey: 'id_folio',
        header: 'Folio',
      },
      {
        accessorKey: 'usuario_creacion_nota',
        header: 'Usuario creacion',
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
    state: { showProgressBars: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    localization: MRT_Localization_ES,
    initialState: {
      showColumnFilters: true,
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 80 },
      showGlobalFilter: true,
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
          setNoteID(row.original.id);
          handleClickOpen();
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
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <h2
          className="font-semibold lg:text-2xl text-primary"
        >
          Notas Costos Extras
        </h2>
        <Button
          radius="full"
          color='success'
          className="text-white"
          onPress={() =>
            fetchData()
          }
        >
          <i className="bi bi-arrow-clockwise"></i> Recargar
        </Button>
      </Box>
    ),
  });

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <CustomNavbar pages={pages}></CustomNavbar>
      <MaterialReactTable table={table} />
      {NoteId && (
        <TravelNoteDetail open={open} handleClose={handleClose} id={NoteId}></TravelNoteDetail>
      )}
    </>
  );

};

export default TravelNotes;
