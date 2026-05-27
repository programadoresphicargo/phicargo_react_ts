import {
  MRT_Cell,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@heroui/react";
import { Box } from '@mui/material';
import odooApi from '@/api/odoo-api';
import { Chip } from '@heroui/react';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@heroui/react';
import { parseDate } from "@internationalized/date";
import AsignacionViaje from './confirmar_cambios';
import { useShiftsContext } from '../hooks/useShiftsContext';
import { Shift } from '../models';
import dayjs from 'dayjs';

type CartaPorte = {
  id_cp: number;
  x_tipo_bel: string;
  x_modo_bel: string;
  dangerous_cargo: boolean;
}

export default function AsignacionViajeModal({ open, setOpen, shift }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, shift: Shift }) {

  const { branchId } = useShiftsContext();
  const [isLoading, setLoading] = useState(false);
  const [cp, setCP] = useState<CartaPorte>();
  const [rawData, setRawData] = useState<CartaPorte[]>([]);
  const [useFilters, setUseFilters] = useState(true);

  const [open2, setOpen2] = useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => { setOpen2(false); fetchData(); };

  function formatDateToYYYYMMDD(date: Date) {
    return date.toISOString().slice(0, 10);
  }

  const now = new Date();
  const first = formatDateToYYYYMMDD(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  const [value, setValue] = React.useState(parseDate(first));

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await odooApi.get('/tms_waybill/plan_viaje_asignacion', {
        params: {
          date_order: value,
          operador_asignado: false,
          store_id: branchId,
        },
      });

      setRawData(response.data); // ← sin filtrar
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    if (!useFilters) return rawData;

    return rawData.filter(item => {
      // --- FILTRO POR MODALIDAD ---
      if (shift?.driver?.modality === 'single') {
        if (item.x_tipo_bel !== 'single') return false;
      }
      // si es 'full' → no se filtra nada

      // --- FILTRO POR PELIGROSO ---
      if (shift?.driver?.isDangerous === false) {
        if (item.dangerous_cargo === true) return false;
      }
      // si es 'SI' → no se filtra nada

      return true; // pasa todos los filtros
    });
  }, [rawData, useFilters, shift]);

  useEffect(() => {
    fetchData();
  }, [value]);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'inicio_programado',
        header: 'Inicio programado',
      },
      {
        accessorKey: 'llegada_planta_programada',
        header: 'Llegada a planta prog',
      },
      {
        accessorKey: 'x_comentarios_maniobra',
        header: 'Comentarios',
      },
      {
        accessorKey: 'cliente',
        header: 'Cliente',
      },
      {
        accessorKey: 'x_ruta_bel',
        header: 'Ruta',
      },
      {
        accessorKey: 'x_reference',
        header: 'Contenedor',
      },
      {
        accessorKey: 'x_tipo_bel',
        header: 'Tipo de armado',
        Cell: ({ cell }: { cell: MRT_Cell<CartaPorte> }) => {
          const value = cell.getValue<string>();

          return (
            <Chip color={value == 'single' ? 'warning' : 'danger'} size='sm' className='text-white'>{value}</Chip>
          );
        },
      },
      {
        accessorKey: 'x_modo_bel',
        header: 'Modo',
        Cell: ({ cell }: { cell: MRT_Cell<CartaPorte> }) => {
          const value = cell.getValue<string>();

          return (
            <Chip color={value == 'imp' ? 'success' : 'primary'} size='sm' className='text-white'>{value}</Chip>
          );
        },
      },
      {
        accessorKey: 'x_clase_bel',
        header: 'Clase',
      },
      {
        accessorKey: 'x_custodia_bel',
        header: 'Custodia',
      },
      {
        accessorKey: 'dangerous_cargo',
        header: 'Peligroso',
        Cell: ({ cell }: { cell: MRT_Cell<CartaPorte> }) => {
          const value = cell.getValue();
          if (!value) return;

          return (
            <Chip color='success' size='sm' className='text-white'>Peligroso</Chip>
          );
        },
      },
      {
        accessorKey: 'referencia_viaje',
        header: 'Viaje',
      },
      {
        accessorKey: 'vehiculo_programado',
        header: 'Vehiculo programado',
        Cell: ({ cell }: { cell: MRT_Cell<CartaPorte> }) => {
          const value = cell.getValue<string>();
          if (!value) return;

          return (
            <Chip color='primary' size='sm' className='text-white'>{value}</Chip>
          );
        },
      },
      {
        accessorKey: 'date_order',
        header: 'Fecha',
      },
      {
        accessorKey: 'carta_porte',
        header: 'Carta porte',
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: filteredData,
    localization: MRT_Localization_ES,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { showProgressBars: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      showGlobalFilter: true,
      density: 'compact',
      expanded: true,
      showColumnFilters: true,
      pagination: { pageSize: 80, pageIndex: 0 },
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
        borderRadius: '8px',
        maxHeight: 'calc(100vh - 350px)',
      },
    },
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActions: ({ row }) => (
      <Button color="primary" className="text-white" radius="full" size='sm' onPress={() => {
        setCP(row.original);
        handleOpen2();
      }}>
        Seleccionar
      </Button>
    ),
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'minmax(360px, 1fr) auto auto auto',
          gap: 2,
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-800">
              Operador
            </h2>
          </CardHeader>
          <Divider></Divider>
          <CardBody>

            <div className="grid grid-cols-4 gap-x-6 gap-y-2 text-sm">

              {/* IZQUIERDA */}
              <span className="text-gray-500">Nombre</span>
              <span className="font-medium text-gray-900">
                {shift?.driver.name}
              </span>

              <span className="text-gray-500">Modalidad</span>
              <span className="font-medium text-gray-900">
                {shift?.driver.modality}
              </span>

              <span className="text-gray-500">Licencia</span>
              <span className="font-medium text-gray-900">
                {shift?.driver.license}
              </span>

              <span className="text-gray-500">Peligroso</span>
              <span className="font-medium text-gray-900">
                {shift?.driver.isDangerous.toString()}
              </span>

              <span className="text-gray-500">Vencimiento</span>
              <span className="font-medium text-gray-900">
                {
                  shift?.driver?.licenseExpiration
                    ? dayjs(shift.driver.licenseExpiration).format("DD/MM/YYYY")
                    : "Sin fecha"
                }
              </span>

              {/* Relleno para cuadrar la grilla */}
              <span />
              <span />

            </div>

          </CardBody>
        </Card>

        <DatePicker
          label="Fecha prevista"
          value={value}
          onChange={(value) => {
            if (value) {
              setValue(value);
            }
          }}
        />

        <Button onPress={() => fetchData()} color='success' className='text-white' radius='full'>Recargar</Button>
        <Button
          radius='full'
          color='primary'
          onPress={() => setUseFilters(prev => !prev)}
        >
          {useFilters ? 'Desactivar filtros' : 'Activar filtros'}
        </Button>

      </Box>
    )
  });

  return (<>
    <AsignacionViaje open={open2} onClose={handleClose2} cp={cp} shift={shift}></AsignacionViaje>
    <Dialog
      open={open}
      fullScreen>
      <AppBar sx={{
        position: 'relative',
        background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
        color: 'white',
      }} elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setOpen(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Asignación de viajes
          </Typography>
          <Button autoFocus onPress={() => setOpen(false)}>
            Cancelar
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <MaterialReactTable table={table}></MaterialReactTable>
      </DialogContent>
    </Dialog>
  </>
  );
}
