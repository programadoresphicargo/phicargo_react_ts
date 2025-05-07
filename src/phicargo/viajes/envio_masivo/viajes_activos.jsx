import { Autocomplete, AutocompleteItem, Textarea } from "@heroui/react";
import { Button, Chip, Spinner } from "@heroui/react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { getLocalTimeZone, now } from "@internationalized/date";

import { Box } from '@mui/material';
import { DatePicker } from "@heroui/react";
import EstatusDropdown from '../estatus/resumen_estatus';
import NavbarViajes from '../navbar';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import odooApi from '@/api/odoo-api';
import { parseDate } from "@internationalized/date";
import toast from 'react-hot-toast';
import { useAuthContext } from "@/modules/auth/hooks";
import { useDateFormatter } from "@react-aria/i18n";

const ViajesActivosMasivo = ({ }) => {
  const [allData, setAllData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedEjecutivo, setSelectedEjecutivo] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/tms_travel/active_travels/');
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
      const response = await odooApi.get('/estatus_operativos/tipo/viaje/monitoreo');
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
          id_viaje: row.id_viaje,
          id_estatus: row.estatus_seleccionado,
          comentarios: row.comentarios ?? '',
          fecha_hora: row.fecha_hora ?? null
        }));

        try {
          setLoading(true);
          const response = await odooApi.post('/tms_travel/reportes_estatus_viajes/envio_masivo/', exportData);
          setLoading(false);

          if (response.data) {
            response.data.forEach((item) => {
              if (item.status === 'success') {
                toast.success(item.message);
              } else {
                toast.error(`Error en el envio.`);
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
        accessorKey: 'name',
        header: 'Referencia',
      },
      {
        accessorKey: 'vehiculo',
        header: 'Vehiculo',
      },
      {
        accessorKey: 'operador',
        header: 'Operador',
      },
      {
        accessorKey: 'ultimo_estatus_enviado',
        header: 'Último estatus enviado',
        Cell: ({ cell }) => (
          <EstatusDropdown
            data={cell.row.original}
          />
        ),
      },
      {
        accessorKey: 'contenedores',
        header: 'Contenedores',
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
        accessorKey: 'hora',
        header: 'Fecha y hora estatus',
        enableColumnPinning: true,
        Cell: ({ row }) => (
          <DatePicker
            hideTimeZone
            showMonthAndYearPickers
            onChange={(selectedDate) => {
              const formattedDate = format(selectedDate.toDate(getLocalTimeZone()), "yyyy-MM-dd HH:mm:ss");
              console.log('Fecha seleccionada:', formattedDate);
              setData((prevData) => {
                const newData = [...prevData];
                newData[row.index].fecha_hora = formattedDate;
                return newData;
              });
            }}
            defaultValue={now(getLocalTimeZone())}
            className="max-w-[284px]"
            label="Hora estatus" />
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

export default ViajesActivosMasivo;
