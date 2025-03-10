import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import Box from '@mui/material/Box';
import { Button, Chip } from "@heroui/react"
import { DatePicker } from 'antd';
import odooApi from '@/phicargo/modules/core/api/odoo-api';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import EstadiasForm from './estadia_form';
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import { MRT_Localization_ES } from 'material-react-table/locales/es';

const { RangePicker } = DatePicker;

const RegistrosEstadias = () => {

  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [dates, setDates] = useState([]);
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState([{ id: 'genero_estadias', value: 'genero' }]);

  // Cargar fechas guardadas en localStorage
  useEffect(() => {
    const savedDates = localStorage.getItem('dates');
    if (savedDates) {
      setDates(JSON.parse(savedDates));
    }
  }, []);

  // Guardar fechas en localStorage cuando cambien
  useEffect(() => {
    if (dates && dates.length === 2) {
      localStorage.setItem('dates', JSON.stringify(dates));
      fetchData();  // Asegurar que siempre se ejecute la consulta al cambiar las fechas
    }
  }, [dates]);

  // Cargar datos desde localStorage al iniciar
  useEffect(() => {
    const savedData = localStorage.getItem('data');
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  const handleDateChange = (newDates) => {
    setDates(newDates);
  };

  const fetchData = async () => {
    if (dates && dates.length === 2 && dates[0] && dates[1]) {
      const startDate = dayjs(dates[0]).format('YYYY-MM-DD');
      const endDate = dayjs(dates[1]).format('YYYY-MM-DD');
      try {
        setLoading(true);
        const response = await odooApi.get('/tms_travel/reporte_estadias/', {
          params: { fecha_inicio: startDate, fecha_fin: endDate },
        });
        setData(response.data);
        localStorage.setItem('data', JSON.stringify(response.data));  // Guardar datos en localStorage
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: 'travel_name', header: 'Referencia' },
      { accessorKey: 'cliente', header: 'Cliente', size: 10 },
      { accessorKey: 'horas_estadias', header: 'Horas estadias' },
      { accessorKey: 'llegada_planta_programada', header: 'Llegada planta programada', size: 150 },
      { accessorKey: 'llegada_planta', header: 'Llegada planta', size: 150 },
      { accessorKey: 'diferencia_llegada_planta', header: 'Diferencia', size: 150 },
      { accessorKey: 'salida_planta', header: 'Salida planta', size: 150 },
      { accessorKey: 'horas_estadia_real', header: 'Tiempo en planta (horas)', size: 150 },
      { accessorKey: 'horas_excedidas', header: 'Horas excedidas', size: 150 },
      { accessorKey: 'cortes_cobrados', header: 'Cortes', size: 150 },
      { accessorKey: 'genero_estadias', header: 'Genero estadias', filterVariant: 'select', filterValue: 'genero', },
    ],
    [],
  );

  useEffect(() => { console.log(filters) }, [filters]);

  const handleClick = (id_viaje) => {
    navigate("/estadias_info", { state: { id_viaje: id_viaje } });
  };

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    enableFacetedValues: true,
    onColumnFiltersChange: setFilters,
    state: { showProgressBars: isLoading },
    localization: MRT_Localization_ES,
    initialState: {
      showColumnFilters: true,
      density: 'compact',
      pagination: { pageSize: 80 },
    },
    state: { columnFilters: filters },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: ({ event }) => {
        handleClick(row.original.travel_id);
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
        maxHeight: 'calc(100vh - 205px)',
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
        <RangePicker onChange={handleDateChange} />
        <Button color="primary" onPress={exportToCSV}>
          Exportar
        </Button>
      </Box>
    ),
  });

  const exportToCSV = () => {
    const csvRows = [];
    const headers = columns.map(column => column.header);
    csvRows.push(headers.join(','));

    data.forEach(row => {
      const values = columns.map(column => {
        const value = row[column.accessorKey];
        return `"${value}"`;
      });
      csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'reporte_cumplimiento.csv');
    a.click();
    URL.revokeObjectURL(url);
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <MaterialReactTable table={table} />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='5xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody>
                <EstadiasForm id_viaje={id_viaje}></EstadiasForm>
              </ModalBody>
              <ModalFooter>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default RegistrosEstadias;
