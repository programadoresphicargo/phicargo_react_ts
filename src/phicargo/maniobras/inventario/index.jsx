import { Button, Chip, Select, SelectItem } from "@heroui/react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Example2 from '../maniobras/modal';
import { ManiobraProvider } from '../context/viajeContext';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { ThemeProvider } from '@mui/material/styles';
import customFontTheme from '../../../theme';
import { exportToCSV } from '../../utils/export';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { DateRangePicker } from 'rsuite';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import CustomNavbar from "@/pages/CustomNavbar";
import { pages } from '../pages';
import RegistroManiobrasCP from "../maniobras/modal";
import { Autocomplete } from "@mui/material";
import { TextField } from "@mui/material";
import { inventarioDB } from "@/db/inventarioDB/inventarioDB";
import TablaContenedores from "./tabla";

const InventarioContenedores = () => {

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ''; // ← obligatorio para que aparezca el alert
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [trailers, setTrailers] = useState([]);
  const [dollies, setDollies] = useState([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const loadFleet = async () => {
      try {
        if (navigator.onLine) {
          const [resTrailers, resDollies] = await Promise.all([
            odooApi.get('/vehicles/fleet_type/trailer'),
            odooApi.get('/vehicles/fleet_type/dolly'),
          ]);

          setTrailers(resTrailers.data);
          setDollies(resDollies.data);

          // Guardar en IndexedDB
          await inventarioDB.trailers.bulkPut(resTrailers.data);
          await inventarioDB.dollies.bulkPut(resDollies.data);
        } else {
          // Offline → leer de IndexedDB
          const localTrailers = await inventarioDB.trailers.toArray();
          const localDollies = await inventarioDB.dollies.toArray();

          setTrailers(localTrailers);
          setDollies(localDollies);
        }
      } catch (e) {
        toast.error("Error al cargar flota");
      }
    };

    loadFleet();
  }, []);

  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await odooApi.get('/tms_waybill/inventario_contenedores');

      const localMap = new Map(
        (await inventarioDB.contenedores.toArray())
          .map(r => [r.id, r])
      );

      const rows = response.data.map(r => ({
        ...r,
        pending_sync: localMap.get(r.id)?.pending_sync ?? false,
        sync_action: localMap.get(r.id)?.sync_action ?? null,
        updated_at: new Date().toISOString(),
      }));

      // guardar en IndexedDB
      for (const row of rows) {
        const local = localMap.get(row.id);

        if (local?.pending_sync) {
          // ⛔ NO sobrescribimos cambios locales
          continue;
        }

        await inventarioDB.contenedores.put(row);
      }

      // siempre renderizar desde DB local
      const localData = await inventarioDB.contenedores.toArray();
      setData(localData);

    } catch (error) {
      toast.error('Error al obtener los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      if (navigator.onLine) {
        await fetchData();
      } else {
        const localData = await inventarioDB.contenedores.toArray();
        setData(localData);
      }
    };

    load();
  }, []);

  const syncOfflineData = async () => {
    if (!navigator.onLine) {
      toast.warning('No tienes conexión a internet');
      return;
    }

    setLoading(true);

    try {
      const pendientes = await inventarioDB.contenedores
        .filter(row =>
          row.pending_sync === true &&
          (row.sync_action === 'create' || row.sync_action === 'update')
        )
        .toArray();

      for (const row of pendientes) {
        try {
          if (row.sync_action === 'create') {
            const res = await odooApi.post(
              '/tms_waybill/control_contenedores/',
              row
            );

            if (res.data?.status === 'success') {
              await inventarioDB.contenedores.update(row.id, {
                id_checklist: res.data.server_data.id_checklist,
                version: res.data.server_data.version,
                updated_at: res.data.server_data.updated_at,
                updated_by: res.data.server_data.updated_by,
                fecha_registro: res.data.server_data.fecha_registro,
                pending_sync: false,
                sync_action: null,
              });
            } else {
              console.warn('Backend rechazó create:', res.data);
            }
          }

          if (row.sync_action === 'update') {
            const res = await odooApi.patch(
              `/tms_waybill/control_contenedores/${row.id_checklist}`,
              row
            );

            if (res.data?.status === 'success') {
              console.log(res.data.server_data);
              await inventarioDB.contenedores.update(row.id, {
                version: res.data.server_data.version,
                pending_sync: false,
                sync_action: null,
              });
            } else if (res.data?.status === 'conflict') {
              toast.error('Alguien ya edito');
              await inventarioDB.contenedores.update(row.id, {
                conflict: true,
                server_snapshot: res.data.server_data,
                pending_sync: false,
                sync_action: null,
              });
            } else {
              toast.error('Backend rechazó update:', res.data);
            }
          }
        } catch (e) {
          console.error('Error HTTP sync:', row.id, e);
        }
      }

      // refrescar UI
      const localData = await inventarioDB.contenedores.toArray();
      setData(localData);

    } finally {
      setLoading(false);
    }
  };

  const table = useMaterialReactTable({
    columns: [],
    data: [],
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          alignItems: 'center',
        }}
      >
        <Button
          color='success'
          fullWidth
          className='text-white'
          startContent={<i class="bi bi-file-earmark-excel"></i>}
          onPress={() => exportToCSV(data, columns, "contenedores.csv")}
          radius="full"
        >Exportar
        </Button>
        <Button
          color='danger'
          fullWidth
          className='text-white'
          startContent={<i class="bi bi-arrow-clockwise"></i>}
          onPress={() => fetchData()}
          radius="full"
        >Recargar
        </Button>
      </Box>
    ),
  });

  return (
    <div>
      <CustomNavbar pages={pages}></CustomNavbar>
      <TablaContenedores data={data} setData={setData} isLoading={isLoading} inventarioDB={inventarioDB} opcionesRemolques={trailers} opcionesDolly={dollies} sincronizar={syncOfflineData} isOnline={isOnline}></TablaContenedores>
    </div >
  );
};

export default InventarioContenedores;
