import { Button, Chip } from "@heroui/react";
import { FormControl, InputLabel, MenuItem } from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Select, SelectItem } from "@heroui/react";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Box } from '@mui/material';
import { CostosExtrasContext } from '@/phicargo/costos/context/context';
import FormularioCostoExtra from '@/phicargo/costos/maniobras/form_costos_extras';
import { TextField } from '@mui/material';
import { ViajeContext } from '../context/viajeContext';
import dayjs from 'dayjs';
import odooApi from '@/api/odoo-api';
import SolicitudForm from "@/phicargo/almacen/solicitud/form";
import { useAlmacen } from "@/phicargo/almacen/contexto/contexto";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import Solicitudes from "@/phicargo/almacen/solicitud/solicitudes";

const SolicitudesEquipoViaje = () => {

  const { id_viaje, getHistorialEstatus, getViaje } = useContext(ViajeContext);

  const [data, setData] = useState([]);
  const [isLoading2, setLoading] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [idSolicitud, setIDSolicitud] = useState();
  const { modoEdicion, setModoEdicion } = useAlmacen();

  const handleShowModal = () => {
    setModalShow(true);
  };

  const handleCloseModal = () => {
    setModalShow(false);
    fetchData();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get(`/tms_travel/solicitudes_equipo/id_viaje/${id_viaje}?solo_entregado=false`);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id_viaje]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Folio',
      },
      {
        accessorKey: 'create_date',
        header: 'Fecha creación',
        size: 150,
        Cell: ({ cell }) => {
          const rawDate = cell.getValue();
          const date = new Date(rawDate);

          if (isNaN(date.getTime())) {
            return "Fecha no válida";
          }

          const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          };

          const formattedDate = date.toLocaleString('es-ES', options);
          return formattedDate;
        },
      },
      {
        accessorKey: 'usuario',
        header: 'Creado por',
      },
      {
        accessorKey: 'operador',
        header: 'Operador',
      },
      {
        accessorKey: 'carta_porte',
        header: 'Cartas porte',
      },
      {
        accessorKey: 'x_tipo',
        header: 'Tipo',
      },
      {
        accessorKey: 'x_studio_estado',
        header: 'Estado',
        Cell: ({ cell }) => {
          const status = cell.getValue() || '';
          let badgeClass = '';

          if (status === 'cancelado') {
            badgeClass = 'danger';
          } else if (status === 'facturado') {
            badgeClass = 'success';
          } else if (status === 'borrador') {
            badgeClass = 'warning';
          } else {
            badgeClass = 'default';
          }

          return (
            <Chip color={badgeClass} size='sm' className="text-white">
              {status}
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
    state: { showProgressBars: isLoading2 },
    enableColumnPinning: true,
    enableStickyHeader: true,
    localization: MRT_Localization_ES,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      showColumnFilters: true,
      pagination: { pageSize: 80 },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 220px)',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: ({ event }) => {
        if (row.subRows?.length) {
        } else {
          handleShowModal();
          setIDSolicitud(row.original.id);
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

    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <h3
          className="tracking-tight font-semibold lg:text-2xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Solicitudes de equipo
        </h3>
        <Button
          radius="full"
          color="primary"
          onPress={() => {
            handleShowModal();
            setModoEdicion(true);
            setIDSolicitud(null);
          }}
        >
          Nueva solicitud
        </Button>
        <Button
          radius="full"
          color="success"
          className="text-white"
          onPress={() => {
            fetchData();
          }}
        >
          Refrescar
        </Button>
      </Box>
    ),
  });

  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>

      <Box sx={{ width: '100%' }}>
        <TabContext value={value}>
          <Box sx={{ borderColor: 'divider', backgroundColor: '#002887', color: 'white' }}>
            <TabList
              visibleScrollbar
              onChange={handleChange}
              textColor="inherit"
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: 'white',
                  height: '3px',
                }
              }}>
              <Tab label="Equipo de protección" value="1" sx={{ fontFamily: 'Inter' }} />
              <Tab label="Equipo de amarre" value="2" sx={{ fontFamily: 'Inter' }} />
            </TabList>
          </Box>
          <TabPanel value="1" sx={{ padding: 0, margin: 0 }}><Solicitudes x_tipo={'epp'} vista={'solicitudes'} travel_id={id_viaje}></Solicitudes></TabPanel>
          <TabPanel value="2" sx={{ padding: 0, margin: 0 }}><Solicitudes x_tipo={'amarre'} vista={'solicitudes'} travel_id={id_viaje}></Solicitudes></TabPanel>
        </TabContext>
      </Box>
    </div >
  );

};

export default SolicitudesEquipoViaje;
