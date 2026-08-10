import {
  Box,
} from '@mui/material';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useEffect, useState } from 'react';
import odooApi from '@/api/odoo-api';
import { Button } from '@heroui/react';
import React from 'react';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import EncuestaCalidadAnswers from './FormAnswers';

const SurveysPage = () => {

  const [open, setOpen] = React.useState(false);
  const [surveyId, setSurveyID] = React.useState<number | null>(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/surveys/responses/');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'sucursal',
      header: 'Sucursal',
    },
    {
      accessorKey: 'cliente',
      header: 'Cliente',
    },
    {
      accessorKey: 'name',
      header: 'Nombre',
    },
    {
      accessorKey: 'position',
      header: 'Puesto',
    },
    {
      accessorKey: 'created_at',
      header: 'Fecha',
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: {
      showProgressBars: isLoading,
    },
    groupedColumnMode: "remove",
    enableColumnPinning: true,
    enableStickyHeader: true,
    positionToolbarAlertBanner: "bottom",
    localization: MRT_Localization_ES,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      showColumnFilters: true,
      pagination: { pageIndex: 0, pageSize: 80 },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableBodyRowProps: ({ row }) => {
      const isGrouped = row.getIsGrouped();

      return {
        onClick: () => {
          if (isGrouped) return;

          const selection = window.getSelection()?.toString();
          if (selection) return;

          handleClickOpen();
          setSurveyID(row.original.id);
        },
        style: {
          color: '#ffcccc',
          cursor: 'pointer',
        },
      };
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 200px)',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '14px',
      },
    },
    muiTopToolbarProps: {
      sx: {
        background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
        color: 'white',
        '& .MuiSvgIcon-root': {
          color: 'white',   // 🎨 iconos en blanco
        },
        '& .MuiButton-root': {
          color: 'white',   // texto de botones en blanco
        },
        '& .MuiInputBase-root': {
          color: 'white',   // texto del buscador
        },
        '& .MuiInputBase-root .MuiSvgIcon-root': {
          color: 'white',   // icono de lupa en blanco
        },
      },
    },
    muiTableBodyCellProps: () => {
      return {
        sx: {
          fontFamily: 'Inter',
          fontWeight: 'normal',
          fontSize: '12px',
        },
      }
    },
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          alignItems: 'center',
        }}
      >
        <h1
          className="font-semibold lg:text-2xl"
        >
          Encuestas
        </h1>
        <Button color='primary' startContent={<i className="bi bi-arrow-clockwise"></i>} onPress={() => fetchData()} radius='full' size='sm'>Actualizar</Button>
      </Box >
    ),
  });

  return (
    <>
      <MaterialReactTable table={table} />
      {surveyId && (
        <EncuestaCalidadAnswers survey_id={surveyId} open={open} handleClose={handleClose}></EncuestaCalidadAnswers>
      )}
    </>
  );
};

export default SurveysPage;

