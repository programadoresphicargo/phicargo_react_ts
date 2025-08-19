import { Autocomplete, Button, Card, CardBody, CardHeader, Chip, Divider, Select, SelectItem, AutocompleteItem } from '@heroui/react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import { DatePicker } from 'antd';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import odooApi from '@/api/odoo-api';
import NavbarInventarioTI from '../../navbar';
import StockCelulares from './stock';
import {
  useDisclosure,
} from "@heroui/react";
import { useInventarioTI } from '../../contexto/contexto';

const AsignacionCelular = () => {

  const [isLoading, setLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { form_data, setFormData } = useInventarioTI();
  const [opciones, setOpciones] = useState([]);

  // Traer opciones desde la API
  useEffect(() => {
    const fetchOpciones = async () => {
      try {
        const response = await odooApi.get('/inventarioti/lineas/estado/disponible'); // cambia tu endpoint
        setOpciones(response.data); // suponiendo que response.data es un array de objetos {id, nombre}
      } catch (error) {
        console.error('Error al obtener opciones:', error);
      }
    };
    fetchOpciones();
  }, [isOpen]);

  const columns = useMemo(
    () => [
      { accessorKey: 'id_celular', header: 'ID Celular' },
      { accessorKey: 'imei', header: 'IMEI' },
      { accessorKey: 'marca', header: 'Marca' },
      { accessorKey: 'modelo', header: 'Modelo' },
      { accessorKey: 'correo', header: 'Correo' },
      { accessorKey: 'id_linea', header: 'ID Linea' },
      {
        accessorKey: 'asignacion', // clave ficticia para la columna
        header: 'Linea',
        Cell: ({ row }) => {
          return (
            <>
              <Autocomplete
                selectedKey={row.original.id_linea}
                label="Linea"
                valu
                onSelectionChange={(e) => {
                  const nuevoId = e;
                  row.original.id_linea = nuevoId;
                  setFormData(prev => ({
                    ...prev,
                    celulares: prev.celulares.map(r =>
                      r.id_celular === row.original.id_celular
                        ? { ...r, id_linea: nuevoId }
                        : r
                    ),
                  }));
                  console.log(form_data.celulares);
                }}
              >
                {opciones.map((animal) => (
                  <AutocompleteItem key={animal.id_linea}>{animal.compañia + '-' + animal.numero}</AutocompleteItem>
                ))}
              </Autocomplete>
            </>
          );
        },
      },
      {
        accessorKey: 'delete',
        header: 'Borrar',
        Cell: ({ cell, row, table }) => {
          return <Button onPress={() => removeCelular(row.original.id_celular)} color='danger' size='sm'> Eliminar</Button>
        },
      }
    ],
    [opciones],
  );

  const removeCelular = (id) => {
    setFormData(prev => ({
      ...prev,
      celulares: (prev.celulares || []).filter(cel => cel.id_celular !== id)
    }));
  };

  const table = useMaterialReactTable({
    columns,
    data: form_data.celulares || [],
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    localization: MRT_Localization_ES,
    state: { showProgressBars: isLoading },
    initialState: {
      showGlobalFilter: true,
      density: 'compact',
      pagination: { pageSize: 80 },
      showColumnFilters: true,
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: ({ event }) => { },
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
    renderTopToolbarCustomActions: ({ table }) => (
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
        <Button color='primary' onPress={onOpen}>Añadir</Button>
      </Box>
    ),
  });

  return (
    <div>
      <StockCelulares isOpen={isOpen} onOpenChange={onOpenChange}></StockCelulares>
      <Card className='mt-3'>
        <CardBody>
          <MaterialReactTable table={table} />
        </CardBody>
      </Card>
    </div>
  );
};

export default AsignacionCelular;

