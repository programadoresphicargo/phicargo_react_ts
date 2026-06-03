import { Autocomplete, Button, Card, CardBody, AutocompleteItem } from '@heroui/react';
import {
  MRT_ColumnDef,
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import odooApi from '@/api/odoo-api';
import StockCelulares from './stock_celular';
import {
  useDisclosure,
} from "@heroui/react";
import { FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove, UseFieldArrayUpdate } from 'react-hook-form';
import { AsignacionActivo } from './form';
import { Celular } from '../celulares/schema';
import { Linea } from '../lineas/form';
import { SelectItem } from '@/types';

interface CelularesProps {
  celularesFields: FieldArrayWithId<AsignacionActivo, "celulares", "id">[];
  appendCelular: UseFieldArrayAppend<AsignacionActivo, "celulares">;
  removeCelular: UseFieldArrayRemove;
  update: UseFieldArrayUpdate<AsignacionActivo, "celulares">;
}

const AsignacionCelular = ({
  celularesFields,
  appendCelular,
  removeCelular,
  update
}: CelularesProps) => {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [opciones, setOpciones] = useState<SelectItem[]>([]);

  useEffect(() => {
    const fetchOpciones = async () => {
      try {
        const response = await odooApi.get<Linea[]>('/inventarioti/lineas/estado/disponible');
        setOpciones(response.data.map((item) => ({
          key: String(item.id_linea),
          value: String(item.numero),
        })));
      } catch (error) {
        console.error('Error al obtener opciones:', error);
      }
    };
    fetchOpciones();
  }, [isOpen]);

  const columns = useMemo<MRT_ColumnDef<Celular>[]>(
    () => [
      { accessorKey: 'imei', header: 'IMEI' },
      { accessorKey: 'marca', header: 'Marca' },
      { accessorKey: 'modelo', header: 'Modelo' },
      { accessorKey: 'correo', header: 'Correo' },
      { accessorKey: 'passwoord', header: 'Contraseña' },
      {
        accessorKey: 'asignacion',
        header: 'Linea',
        Cell: ({ row }: { row: MRT_Row<Celular> }) => {
          return (
            <>
              <Autocomplete
                items={opciones}
                selectedKey={row.original.id_linea ? String(row.original.id_linea) : ''}
                label="Linea"
                onSelectionChange={(key) => {
                  update(row.index, {
                    ...row.original,
                    id_linea: Number(key),
                  });
                }}
              >
                {(item) => (
                  <AutocompleteItem key={item.key} className="capitalize">
                    {item.value}
                  </AutocompleteItem>
                )}
              </Autocomplete >
            </>
          );
        },
      },
      {
        accessorKey: 'delete',
        header: 'Borrar',
        Cell: ({ row }: { row: MRT_Row<Celular> }) => {
          return <Button onPress={() => removeCelular(row.index)} color='danger' size='sm' radius='full'> Eliminar</Button>
        },
      }
    ],
    [opciones],
  );

  const table = useMaterialReactTable({
    columns,
    data: celularesFields || [],
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
      onClick: () => { },
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
          Asignación celular
        </h1>
        <Button color='success' className='text-white' onPress={onOpen} radius='full'><i className="bi bi-plus-circle"></i> Añadir celular</Button>
      </Box>
    ),
  });

  return (
    <>
      <StockCelulares isOpen={isOpen} onOpenChange={onOpenChange} appendCelular={appendCelular} celularesFields={celularesFields}></StockCelulares>
      <Card>
        <CardBody>
          <MaterialReactTable table={table} />
        </CardBody>
      </Card>
    </>
  );
};

export default AsignacionCelular;

