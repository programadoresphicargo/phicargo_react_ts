import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import toast from 'react-hot-toast';
import React, { useEffect, useMemo, useState } from 'react';

import { Box } from '@mui/material';
import { Button, Chip } from "@heroui/react";
import { Autocomplete, AutocompleteItem, Textarea } from "@heroui/react";
import Swal from 'sweetalert2';

import odooApi from '@/phicargo/modules/core/api/odoo-api';
import { useAuthContext } from '@/phicargo/modules/auth/hooks';
import { Dropdown, DropdownMenu, DropdownTrigger, DropdownItem } from "@heroui/react";
import { Spinner } from "@heroui/spinner";
import EstatusDropdownManiobra from '../reportes_estatus/resumen_estatus';

const ManiobrasActivasMasivos = ({ }) => {
  const [allData, setAllData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedEjecutivo, setSelectedEjecutivo] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/maniobras/by_estado/', {
        params: { estado: 'activa' }
      });
      setAllData(response.data);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedEjecutivo(selectedValue);

    if (selectedValue) {
      setData(allData.filter(item => item.ejecutivo && item.ejecutivo.includes(selectedValue)));
    } else {
      setData(allData);
    }
  };

  const getUniqueEjecutivos = () => {
    return [...new Set(allData.map(item => item.ejecutivo))];
  };

  const fetchEstatus = async () => {
    try {
      const response = await odooApi.get('/estatus_operativos/tipo/maniobra');
      const data = response.data.map((item) => ({
        key: item.id_estatus,
        label: item.nombre_estatus,
      }));
      setOptions(data);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchEstatus();
  }, []);

  const handleRowDelete = (rowIndex) => {
    setData((prevData) => prevData.filter((_, index) => index !== rowIndex));
  };

  const handleExportData = async () => {
    const invalidRows = data.filter(row => row.estatus_seleccionado == null);

    if (invalidRows.length > 0) {
      toast.error('Existen filas con estatus_seleccionado nulo.');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se enviarán los correos masivos para los viajes seleccionados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const exportData = data.map((row) => ({
          id_maniobra: row.id_maniobra,
          estatus_seleccionado: row.estatus_seleccionado,
          comentarios: row.comentarios ?? '',
        }));

        console.log('Export Data:', exportData);

        try {
          setLoading(true);
          const response = await odooApi.post('/maniobras/envio_masivo/', exportData);
          setLoading(false);

          if (response.data) {
            console.log('Respuesta de la API:', response.data);

            response.data.forEach((item) => {
              if (item.status === 'Correo enviado correctamente') {
                toast.success(`Maniobra ${item.id_maniobra}: Correo enviado con éxito`);
              } else {
                toast.error(`Maniobra ${item.id_maniobra}: ${item.status}`);
              }
            });

            toast.success('Envío exitoso, los correos han sido enviados correctamente.');
          } else {
            toast.error('No se recibió una respuesta válida del servidor');
          }
        } catch (error) {
          setLoading(false);
          toast.error('Error al obtener los datos: ' + error.message);
        }
      }
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'sucursal',
        header: 'Sucursal',
      },
      {
        accessorKey: 'terminal',
        header: 'Terminal',
      },
      {
        accessorKey: 'unidad',
        header: 'Unidad',
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return (
            <Chip color='primary'>
              {value}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'nombre_operador',
        header: 'Operador',
        size: 150,
      },
      {
        accessorKey: 'tipo_maniobra',
        header: 'Tipo de maniobra',
        Cell: ({ cell }) => {
          const value = cell.getValue();

          let variant = 'default';
          if (value === 'retiro') {
            variant = 'success';
          } else if (value === 'ingreso') {
            variant = 'primary';
          } else if (value === 'local') {
            variant = 'danger';
          }

          return (
            <Chip color={variant} className="text-white">
              {value}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'contenedores_ids',
        header: 'Contenedor',
        size: 150,
      },
      {
        accessorKey: 'ultimo_estatus',
        header: 'Último estatus enviado',
        Cell: ({ cell }) => (
          <EstatusDropdownManiobra
            id_maniobra={cell.row.original.id_maniobra}
            ultimo_estatus={cell.getValue() || ''}
          />
        ),
      },
      {
        accessorKey: 'estatus_seleccionado',
        header: 'Estatus',
        enableColumnPinning: true,
        Cell: ({ cell, row }) => (
          <Autocomplete
            className="max-w-md"
            defaultItems={options}
            label="Estatus"
            placeholder="Selecciona un estatus"
            value={row.original.estatus_seleccionado}
            onSelectionChange={(value) => {
              setData((prevData) => {
                const newData = [...prevData];
                newData[row.index].estatus_seleccionado = value;
                return newData;
              });
            }}
          >
            {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
          </Autocomplete>
        ),
      },
      {
        accessorKey: 'comentarios',
        header: 'Comentarios',
        enableColumnPinning: true,
        Cell: ({ row }) => (
          <Textarea
            className="max-w-xs"
            label="Comentarios"
            placeholder="Comentarios"
            rows={2}
            value={row.original.comentarios}
            onChange={(e) => {
              setData((prevData) => {
                const newData = [...prevData];
                newData[row.index].comentarios = e.target.value;
                return newData;
              });
            }}
          />
        ),
      },
      {
        id: 'actions',
        header: 'Acciones',
        Cell: ({ row }) => (
          <Button color="danger" onClick={() => handleRowDelete(row.index)}>
            Eliminar
          </Button>
        ),
      },
    ],
    [options, data]
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
    positionGlobalFilter: "right",
    muiSearchTextFieldProps: {
      placeholder: `Buscar en ${data.length} viajes`,
      sx: { minWidth: '300px' },
      variant: 'outlined',
    },
    columnResizeMode: "onEnd",
    initialState: {
      showGlobalFilter: true,
      density: 'compact',
      expanded: true,
      showColumnFilters: true,
      pagination: { pageSize: 80 },
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
        maxHeight: 'calc(100vh - 200px)',
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row.subRows?.length ? '#0456cf' : '#FFFFFF',
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
        color: row.subRows?.length ? '#FFFFFF' : '#000000',
      },
    }),
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button onPress={handleExportData} color="primary" isLoading={isLoading}>
          Enviar estatus
        </Button>

        <Button onPress={() => fetchData()} color="primary" isLoading={isLoading}>
          Refrescar
        </Button>

        <select onChange={handleSelectChange} value={selectedEjecutivo} className='form-control'>
          <option value="">Todos los ejecutivos</option>
          {getUniqueEjecutivos().map((ejecutivo, index) => (
            <option key={index} value={ejecutivo}>{ejecutivo}</option>
          ))}
        </select>
      </Box>
    ),
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>);
};

export default ManiobrasActivasMasivos;
