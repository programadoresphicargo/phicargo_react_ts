import { Button, Chip } from "@heroui/react";
import {
  MRT_Cell,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import AccesoCompo from './AccesoCompo';
import AccesoForm from './formulario';
import AppBar from '@mui/material/AppBar';
import { Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import odooApi from '@/api/odoo-api';
import { MRT_Localization_ES } from 'material-react-table/locales/es';

type EstadoAcceso = 'espera' | 'validado' | 'autorizado' | 'rechazado';

const colorMap: Record<EstadoAcceso, "warning" | "success" | "primary" | "danger"> = {
  espera: 'warning',
  validado: 'success',
  autorizado: 'primary',
  rechazado: 'danger',
};

const iconMap: Record<EstadoAcceso | 'default', string> = {
  espera: 'bi-clock',
  validado: 'bi-check-circle',
  autorizado: 'bi-shield-check',
  rechazado: 'bi-x-circle',
  default: 'bi-info-circle',
};

type Acceso = {
  id_acceso: number;
  empresa: string;
};

type TablaAccesosProps = {
  title: string;
  tipo: string;
  background: string;
};

const TablaAccesos: React.FC<TablaAccesosProps> = ({
  title,
  tipo,
  background
}) => {

  const [open, setOpen] = React.useState(false);
  const [id_acceso, setIDAcceso] = useState<number | null>(null);
  const [data, setData] = useState<Acceso[]>([]);
  const [isLoading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const NuevoAcceso = () => {
    setOpen(true);
    setIDAcceso(null);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/accesos/tipo_acceso/' + tipo);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id_acceso',
        header: 'ID Acceso',
      },
      {
        accessorKey: 'empresa',
        header: 'Empresa visitante',
        Cell: ({ cell }: { cell: MRT_Cell<Acceso> }) => (
          <span style={{ fontWeight: 'bold' }}>{cell.getValue<string>()?.toUpperCase()}</span>
        ),
      },
      {
        accessorKey: 'marca',
        header: 'Marca',
      },
      {
        accessorKey: 'modelo',
        header: 'Modelo',
      },
      {
        accessorKey: 'placas',
        header: 'Placas',
      },
      {
        accessorKey: 'tipo_movimiento',
        header: 'Tipo de movimiento',
        Cell: ({ cell }) => {
          const tipoMovimiento = cell.getValue<string>();

          return (
            <Chip color={tipoMovimiento === "entrada" ? "success" : "danger"} size="sm" className={"text-white"}>
              {tipoMovimiento?.toUpperCase()}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'fecha_entrada',
        header: 'Fecha de entrada',
        Cell: ({ cell }) => {
          const rawDate = cell.getValue<string>();
          return dayjs(rawDate).format('DD/MM/YYYY h:mm A');
        },
      },
      {
        accessorKey: 'nombre',
        header: 'Solicita',
        Cell: ({ cell }) => {
          const usuario = cell.getValue<string>()?.toUpperCase();

          return (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="bi bi-person-fill"></i>
              {usuario}
            </span>
          );
        },
      },
      {
        accessorKey: 'personas',
        header: 'Visitantes / Empleados',
        Cell: ({ cell }) => {
          const personas = cell.getValue<string[]>();

          if (!personas || personas.length === 0) {
            return <span>-</span>;
          }

          return (
            <div>
              {personas.map((p: any) => (
                <div key={p.id_persona}>
                  {p.persona}
                </div>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: 'empresa_visitada',
        header: 'Empresa visitada',
        Cell: ({ cell }) => (
          <span style={{ fontWeight: 'bold' }}>{cell.getValue<string>()?.toUpperCase()}</span>
        ),
      },
      {
        accessorKey: 'estado_acceso',
        header: 'Estado del acceso',
        Cell: ({ cell }) => {
          const tipoMovimiento = cell.getValue<string>() as EstadoAcceso;

          const badgeClass = colorMap[tipoMovimiento] ?? 'secondary';
          const iconClass = iconMap[tipoMovimiento] ?? iconMap.default;

          const displayText =
            tipoMovimiento === 'espera'
              ? 'En espera de validación'
              : tipoMovimiento.charAt(0).toUpperCase() + tipoMovimiento.slice(1);

          return (
            <Chip color={badgeClass} size='sm' className="text-white flex items-center gap-1">
              <i className={`bi ${iconClass}`}></i> {displayText}
            </Chip>
          );
        },
      }
    ],
    [],
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
    columnResizeMode: "onEnd",
    localization: MRT_Localization_ES,
    initialState: {
      showColumnFilters: true,
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 80 },
      showGlobalFilter: true,
      columnVisibility: {
        personas: tipo == 'autorizacion' ? true : false,
        marca: tipo == 'vehicular' ? true : false,
        modelo: tipo == 'vehicular' ? true : false,
        placas: tipo == 'vehicular' ? true : false,
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        if (row.subRows?.length) {
        } else {
          handleClickOpen();
          setIDAcceso(row.original.id_acceso);
        }
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
        maxHeight: 'calc(100vh - 200px)',
      },
    },
    muiTopToolbarProps: {
      sx: {
        background: background,
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
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <h2
          className="font-semibold lg:text-2xl"
        >
          {title}
        </h2>
        <Button
          radius="full"
          color='primary'
          onPress={() =>
            NuevoAcceso()
          }
        >
          <i className="bi bi-plus-lg"></i> Nuevo registro
        </Button>
        <Button
          radius="full"
          color='success'
          className="text-white"
          onPress={() =>
            fetchData()
          }
        >
          <i className="bi bi-arrow-clockwise"></i> Recargar
        </Button>
      </Box>
    ),
  });

  return (<>

    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
    >
      <AppBar elevation={0}
        position="static"
        sx={{
          background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
          color: 'white',
          fontWeight: 'bold'
        }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Acceso
          </Typography>
          <Button autoFocus onPress={handleClose}>
            Cerrar
          </Button>
        </Toolbar>
      </AppBar>
      <AccesoCompo>
        <AccesoForm id_acceso={id_acceso} onClose={handleClose}
        />
      </AccesoCompo>
    </Dialog>

    <MaterialReactTable table={table} />
  </>
  );

};

export default TablaAccesos;
