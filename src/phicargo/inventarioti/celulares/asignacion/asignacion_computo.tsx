import { Button, Card, CardBody } from '@heroui/react';
import {
  MRT_ColumnDef,
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useMemo } from 'react';
import Box from '@mui/material/Box';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import {
  useDisclosure,
} from "@heroui/react";
import StockComputo from './stock_computo';
import { FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove } from 'react-hook-form';
import { AsignacionActivo } from './form';
import { EquipoComputo } from '../equipo_computo/form';

interface EquipoComputoProps {
  equiposFields: FieldArrayWithId<AsignacionActivo, "equipo_computo", "id">[];
  appendEquipo: UseFieldArrayAppend<AsignacionActivo, "equipo_computo">;
  removeEquipo: UseFieldArrayRemove;
}

const AsignacionComputo = ({
  equiposFields,
  appendEquipo,
  removeEquipo,
}: EquipoComputoProps) => {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const columns = useMemo<MRT_ColumnDef<EquipoComputo>[]>(
    () => [
      { accessorKey: 'sn', header: 'SN' },
      { accessorKey: 'so', header: 'SO' },
      { accessorKey: 'marca', header: 'Marca' },
      { accessorKey: 'modelo', header: 'Modelo' },
      {
        accessorKey: 'delete',
        header: 'Borrar',
        Cell: ({ row }: { row: MRT_Row<EquipoComputo> }) => {
          return <Button onPress={() => removeEquipo(row.index)} color='danger' size='sm' radius='full'> Eliminar</Button>
        },
      }
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: equiposFields || [],
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    localization: MRT_Localization_ES,
    initialState: {
      showGlobalFilter: true,
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 80 },
    },
    muiTableBodyRowProps: () => ({
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
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
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
        maxHeight: 'calc(100vh - 170px)',
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
        <h1
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Asignación Computo
        </h1>
        <Button color='success' className='text-white' onPress={onOpen} radius='full'><i className="bi bi-plus-circle"></i> Añadir equipo de computo</Button>
      </Box>
    ),
  });

  return (
    <>
      <StockComputo isOpen={isOpen} onOpenChange={onOpenChange} equiposFields={equiposFields} appendEquipo={appendEquipo}></StockComputo>
      <Card className='mt-3'>
        <CardBody>
          <MaterialReactTable table={table} />
        </CardBody>
      </Card>
    </>
  );
};

export default AsignacionComputo;

