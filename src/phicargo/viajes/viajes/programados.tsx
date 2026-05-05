import {
  MRT_Cell,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { Button } from '@heroui/react';
import { Chip } from "@heroui/react";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { exportToCSV } from '../../utils/export';
import odooApi from '@/api/odoo-api';
import { DateRangePicker } from 'rsuite';
import NavbarTravel from '../navbar_viajes';
import Travel from '../control/viaje';
import Viaje from '../viaje';

type Viaje = {
  id_viaje: number;
  name: string;
  ejecutivo: string;
  ultimo_envio_ejecutivo: string;
  codigo_postal: number;
  distancia_km: number;
  tiempo_estimado_horas: number;
  observacion_ubicacion: string;
  inicio_programado: string;
};

const ViajesProgramados = ({ }) => {

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [range, setRange] = useState<[Date, Date] | null>([firstDay, lastDay]);

  const [open, setOpen] = React.useState(false);
  const [idViaje, setIDViaje] = React.useState<number | null>(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!range) return;
    try {
      setLoading(true);
      const response = await odooApi.get('/tms_travel/scheduled_travels/', {
        params: {
          date_start: range[0].toISOString().slice(0, 10),
          date_end: range[1].toISOString().slice(0, 10)
        }
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range]);

  const { cantidadRojo, cantidadAmarillo } = useMemo(() => {
    let rojo = 0;
    let amarillo = 0;
    const ahora = new Date();

    data.forEach((item: Viaje) => {
      const inicio = new Date(item.inicio_programado);
      const diffMs = inicio.getTime() - ahora.getTime();
      const diffHoras = diffMs / (1000 * 60 * 60);

      if (diffMs < 0) {
        rojo++;
      } else if (diffHoras <= 1) {
        amarillo++;
      }
    });

    return { cantidadRojo: rojo, cantidadAmarillo: amarillo };
  }, [data]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'empresa',
        header: 'Empresa',
      },
      {
        accessorKey: 'sucursal',
        header: 'Sucursal',

      },
      {
        accessorKey: 'name',
        header: 'Referencia',
        Cell: ({ cell }: { cell: MRT_Cell<Viaje> }) => {
          const Referencia = cell.getValue();

          return (
            <>
              {Referencia}
              {(
                cell.row.original.ejecutivo === 'OLIVA TORRES JESUS ANGEL ROMAN' ||
                cell.row.original.ejecutivo === 'Abraham Josué Barrientos López '
              ) && (
                  <Chip
                    size="sm"
                    color="warning"
                    className="text-white"
                  >
                    Viaje local
                  </Chip>
                )}
            </>
          );
        },
      },
      {
        accessorKey: 'carta_porte',
        header: 'Carta porte',
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
        accessorKey: 'ruta',
        header: 'Ruta',
      },
      {
        accessorKey: 'custodia',
        header: 'Custodia',
        Cell: ({ cell }) => {
          const value = cell.getValue();

          if (value !== 'yes') return null;

          return (
            <div
              style={{
                backgroundColor: '#4caf50',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              Yes
            </div>
          );
        },
      },
      {
        accessorKey: 'estado_correos',
        header: 'Correos ligados',
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          let badgeClass = 'badge rounded-pill text-white ';

          if (value === 'Correos ligados') {
            badgeClass += 'bg-primary text-white';
          } else {
            badgeClass += 'bg-secondary text-white';
          }

          return (
            <Chip className={badgeClass} style={{ width: '100px' }}>
              {value}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'inicio_programado',
        header: 'Inicio programado',
      },
      {
        accessorKey: 'contenedores',
        header: 'Contenedores',
      },
      {
        accessorKey: 'ejecutivo',
        header: 'Ejecutivo',
      },
      {
        accessorKey: 'tipo_armado',
        header: 'Armado',
        Cell: ({ cell }) => {
          const tipoMovimiento = cell.getValue<string>();

          return (
            <Chip color={tipoMovimiento === "single" ? "success" : "danger"} style={{ width: '60px' }} className={'text-white'}>
              {tipoMovimiento}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'tipo',
        header: 'Modalidad',
        Cell: ({ cell }) => {
          const tipoMovimiento = cell.getValue<string>();

          return (
            <Chip color={tipoMovimiento == "imp" ? "warning" : "danger"} style={{ width: '60px' }} className={"text-white"}>
              {tipoMovimiento}
            </Chip>
          );
        },
      },
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
    groupedColumnMode: 'remove',
    positionToolbarAlertBanner: 'bottom',
    enableColumnPinning: true,
    enableStickyHeader: true,
    localization: MRT_Localization_ES,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      showColumnFilters: true,
      pagination: { pageIndex: 0, pageSize: 80 },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableBodyRowProps: ({ row }) => {
      return {
        onClick: () => {
          handleClickOpen();
          setIDViaje(row.original.id_viaje);
        },
        style: {
          color: '#ffcccc',
          cursor: 'pointer',
        },
      };
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 200px)',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '14px',
      },
    },
    muiTopToolbarProps: {
      sx: {
        background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
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
    muiTableBodyCellProps: ({ row }) => {
      const inicioProgramado = new Date(row.original.inicio_programado);
      const ahora = new Date();
      const diferenciaMs = inicioProgramado.getTime() - ahora.getTime();
      const diferenciaHoras = diferenciaMs / (1000 * 60 * 60);

      let backgroundColor = '';
      let ColorText = '';

      if (diferenciaMs < 0) {
        backgroundColor = '#f31260';
        ColorText = '#FFFFFF';
      } else if (diferenciaHoras <= 1) {
        backgroundColor = '#f5a524';
        ColorText = '#FFFFFF';
      }

      return {
        sx: {
          backgroundColor: backgroundColor,
          color: ColorText,
          fontFamily: 'Inter',
          fontWeight: 'normal',
          fontSize: '12px',
        },
      }
    },
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          alignItems: 'center',
        }}
      >
        <h1
          className="font-semibold lg:text-2xl"
        >
          Programación de viajes
        </h1>
        <DateRangePicker
          value={range}
          onChange={(value) => setRange(value)}
          placeholder="Selecciona un rango de fechas"
          format="yyyy-MM-dd"
          loading={isLoading}
        />
        <Chip color="danger" className="text-white" size='lg'>
          Retrasados: {cantidadRojo}
        </Chip>
        <Chip color="warning" className="text-white" size='lg'>
          Proximos a salir: {cantidadAmarillo}
        </Chip>
        <Button color='primary' startContent={<i className="bi bi-arrow-clockwise"></i>} onPress={() => fetchData()} radius='full' size='sm'>Actualizar</Button>
        <Button color='success' className='text-white' startContent={<i className="bi bi-file-earmark-excel"></i>} onPress={() => exportToCSV(data, columns, "programacion_viajes.csv")} radius='full' size='sm'>Exportar</Button>
      </Box >
    ),
  });

  return (
    <>
      <NavbarTravel></NavbarTravel>
      <MaterialReactTable table={table} />
      <Travel idViaje={idViaje} open={open} handleClose={handleClose}></Travel>
    </>
  );
};

export default ViajesProgramados;
