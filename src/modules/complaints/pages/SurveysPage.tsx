import { Box } from '@mui/material';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@heroui/react';

import odooApi from '@/api/odoo-api';
import { exportToCSV } from '@/phicargo/utils/export';
import EncuestaCalidadAnswers from './FormAnswers';

type SurveyRow = Record<string, any> & {
  id?: number;
  sucursal?: string;
  cliente?: string;
  nombre?: string;
  puesto?: string;
  fecha?: string;
  __isAverage?: boolean;
};

const EXCLUDED_COLUMNS = new Set([
  'id',
  'sucursal',
  'cliente',
  'nombre',
  'puesto',
  'fecha',
  '__isAverage',
]);

const SurveysPage = () => {
  const [open, setOpen] = useState(false);
  const [surveyId, setSurveyID] = useState<number | null>(null);
  const [data, setData] = useState<SurveyRow[]>([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await odooApi.get('/surveys/responses/');

      setData(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error('Error al obtener las encuestas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleClickOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSurveyID(null);
    void fetchData();
  }, [fetchData]);

  // Obtener las preguntas una sola vez por cada actualización de datos.
  const questionColumns = useMemo(() => {
    const keys = new Set<string>();

    for (const row of data) {
      for (const key of Object.keys(row)) {
        if (!EXCLUDED_COLUMNS.has(key)) {
          keys.add(key);
        }
      }
    }

    return Array.from(keys);
  }, [data]);

  // Columnas fijas y dinámicas memorizadas.
  const columns = useMemo<MRT_ColumnDef<SurveyRow>[]>(() => {
    const fixedColumns: MRT_ColumnDef<SurveyRow>[] = [
      {
        accessorKey: 'sucursal',
        header: 'Sucursal',
        enableGrouping: true,
      },
      {
        accessorKey: 'cliente',
        header: 'Cliente',
        enableGrouping: true,
      },
      {
        accessorKey: 'nombre',
        header: 'Nombre',
        enableGrouping: false,
      },
      {
        accessorKey: 'puesto',
        header: 'Puesto',
        enableGrouping: true,
      },
      {
        accessorKey: 'fecha',
        header: 'Fecha',
        enableGrouping: false,
      },
    ];

    const dynamicColumns: MRT_ColumnDef<SurveyRow>[] =
      questionColumns.map((key) => ({
        accessorKey: key,
        header: key,
        size: 220,
        minSize: 160,

        // Evita agrupar accidentalmente por cada pregunta.
        enableGrouping: false,
      }));

    return [...fixedColumns, ...dynamicColumns];
  }, [questionColumns]);

  // Calcular el promedio solo cuando cambien los datos o las preguntas.
  const averageRow = useMemo<SurveyRow>(() => {
    const row: SurveyRow = {
      __isAverage: true,
      nombre: 'PROMEDIO',
    };

    for (const key of questionColumns) {
      let sum = 0;
      let count = 0;

      for (const survey of data) {
        const value = survey[key];

        if (
          value !== null &&
          value !== undefined &&
          value !== '' &&
          String(value).trim() !== '' &&
          Number.isFinite(Number(value))
        ) {
          sum += Number(value);
          count++;
        }
      }

      row[key] =
        count > 0
          ? Number((sum / count).toFixed(2))
          : null;
    }

    return row;
  }, [data, questionColumns]);

  const tableData = useMemo(
    () => [...data, averageRow],
    [data, averageRow]
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,

    // Virtualización: renderizar solo las filas y columnas visibles.
    enableRowVirtualization: true,
    enableColumnVirtualization: true,

    rowVirtualizerOptions: {
      overscan: 8,
    },
    columnVirtualizerOptions: {
      overscan: 4,
    },

    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    enableColumnPinning: true,
    enableStickyHeader: true,

    groupedColumnMode: 'remove',
    positionToolbarAlertBanner: 'bottom',
    localization: MRT_Localization_ES,
    columnResizeMode: 'onEnd',

    state: {
      showProgressBars: isLoading,
    },

    initialState: {
      density: 'compact',
      showColumnFilters: true,
      pagination: {
        pageIndex: 0,
        pageSize: 80,
      },
    },

    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: 0,
      },
    },

    muiTableBodyRowProps: ({ row }) => {
      const isGrouped = row.getIsGrouped();
      const isAverage = row.original.__isAverage === true;

      return {
        onClick: () => {
          if (isGrouped || isAverage || !row.original.id) {
            return;
          }

          // No abrir el modal cuando el usuario selecciona texto.
          if (window.getSelection()?.toString()) {
            return;
          }

          setSurveyID(row.original.id!);
          handleClickOpen();
        },

        sx: {
          cursor: isAverage ? 'default' : 'pointer',
          backgroundColor: isAverage ? '#E8F0FE' : undefined,

          '& td': {
            fontWeight: isAverage ? 700 : 400,
            borderTop: isAverage
              ? '2px solid #0456cf'
              : undefined,
          },
        },
      };
    },

    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 200px)',
        overflow: 'auto',
      },
    },

    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 700,
        fontSize: '14px',
      },
    },

    muiTableBodyCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '12px',
      },
    },

    muiTopToolbarProps: {
      sx: {
        background:
          'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
        color: 'white',

        '& .MuiSvgIcon-root': {
          color: 'white',
        },

        '& .MuiButton-root': {
          color: 'white',
        },

        '& .MuiInputBase-root': {
          color: 'white',
        },

        '& .MuiInputBase-root .MuiSvgIcon-root': {
          color: 'white',
        },
      },
    },

    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '8px',
          alignItems: 'center',
        }}
      >
        <h1 className="font-semibold lg:text-2xl">
          Encuestas
        </h1>

        <Button
          color="primary"
          startContent={
            <i className="bi bi-arrow-clockwise" />
          }
          onPress={() => void fetchData()}
          isDisabled={isLoading}
          radius="md"
          size="sm"
        >
          Actualizar
        </Button>

        <Button
          color="success"
          className="text-white"
          startContent={
            <i className="bi bi-file-earmark-excel" />
          }
          onPress={() =>
            exportToCSV(tableData, columns, 'encuestas.csv')
          }
          isDisabled={isLoading}
          radius="md"
          size="sm"
        >
          Exportar
        </Button>
      </Box>
    ),
  });

  return (
    <>
      <MaterialReactTable table={table} />

      {surveyId !== null && (
        <EncuestaCalidadAnswers
          survey_id={surveyId}
          open={open}
          handleClose={handleClose}
        />
      )}
    </>
  );
};

export default SurveysPage;