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
import { exportToCSV } from '@/phicargo/utils/export';

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

  const fixedColumns: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'sucursal',
      header: 'Sucursal',
    },
    {
      accessorKey: 'cliente',
      header: 'Cliente',
    },
    {
      accessorKey: 'nombre',
      header: 'Nombre',
    },
    {
      accessorKey: 'puesto',
      header: 'Puesto',
    },
    {
      accessorKey: 'fecha',
      header: 'Fecha',
    },
  ];

  const excludedColumns = [
    'id',
    'sucursal',
    'cliente',
    'nombre',
    'puesto',
    'fecha',
  ];

  const questionColumns = Array.from(
    new Set(data.flatMap((row: any) => Object.keys(row)))
  ).filter((key) => !excludedColumns.includes(key));

  const columns: MRT_ColumnDef<any>[] = [
    ...fixedColumns,
    ...questionColumns.map((key) => ({
      accessorKey: key,
      header: key,
      size: 220,
      minSize: 160,
    })),
  ];

  // Calcular promedio por cada columna numérica
  const averageRow: Record<string, any> = {
    nombre: 'PROMEDIO',
  };

  questionColumns.forEach((key) => {
    const values = data
      .map((row: any) => row[key])
      .filter(
        (value: any) =>
          value !== null &&
          value !== undefined &&
          value !== '' &&
          Number.isFinite(Number(value))
      )
      .map((value: any) => Number(value));

    averageRow[key] =
      values.length > 0
        ? Number(
          (
            values.reduce((sum, value) => sum + value, 0) /
            values.length
          ).toFixed(2)
        )
        : null;
  });

  // Agregar la fila al final
  const tableData = [...data, averageRow];

  const table = useMaterialReactTable({
    columns,
    data: tableData,
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
      const isAverage = row.original.nombre === 'PROMEDIO';

      return {
        onClick: () => {
          if (isGrouped || isAverage) return;

          const selection = window.getSelection()?.toString();
          if (selection) return;

          handleClickOpen();
          setSurveyID(row.original.id);
        },
        sx: {
          cursor: isAverage ? 'default' : 'pointer',
          backgroundColor: isAverage ? '#E8F0FE' : undefined,
          fontWeight: isAverage ? 700 : 400,
          '& td': {
            fontWeight: isAverage ? 700 : 400,
            borderTop: isAverage ? '2px solid #0456cf' : undefined,
          },
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
        <Button color='primary' startContent={<i className="bi bi-arrow-clockwise"></i>} onPress={() => fetchData()} radius='md' size='sm'>Actualizar</Button>
        <Button
          color='success'
          className='text-white'
          startContent={<i className="bi bi-file-earmark-excel"></i>}
          onPress={() => exportToCSV(tableData, columns, "encuestas.csv")}
          radius='md'
          size='sm'
        >Exportar
        </Button>
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

