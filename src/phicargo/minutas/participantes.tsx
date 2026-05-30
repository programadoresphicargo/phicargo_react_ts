import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useMemo } from 'react';
import { Box } from '@mui/material';
import { Card, CardBody, CardHeader } from "@heroui/react";
import AñadirParticipantes from './list_empleados';
import { useMinutas } from './context';
import { MRT_Localization_ES } from 'material-react-table/locales/es';

const ParticipantesMinutas = ({ }) => {

  const { selectedRows, isEditing } = useMinutas();

  const columns = useMemo(
    () => [
      {
        accessorKey: 'empleado',
        header: 'Empleado',
      },
      {
        accessorKey: 'puesto',
        header: 'Puesto',
      },
    ],
    [isEditing]
  );

  const table = useMaterialReactTable({
    columns,
    data: selectedRows,
    getRowId: (row) => row.id_empleado,
    localization: MRT_Localization_ES,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 80 },
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
    muiTableBodyCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 210px)',
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
        <AñadirParticipantes></AñadirParticipantes>
      </Box>
    ),
  });

  return (<>
    <Card>
      <CardHeader
        style={{
          background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
          color: 'white',
          fontWeight: 'bold'
        }}>
        Participantes
      </CardHeader>
      <CardBody>
        <MaterialReactTable table={table} />
      </CardBody>
    </Card>
  </>
  );

};

export default ParticipantesMinutas;
