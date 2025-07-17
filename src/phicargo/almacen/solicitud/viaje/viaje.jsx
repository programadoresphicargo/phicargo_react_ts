import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Input, Popover, PopoverContent, PopoverTrigger,
  User, useDisclosure, Avatar, Button, Chip,
  Autocomplete, AutocompleteItem
} from "@heroui/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Box, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Slide from '@mui/material/Slide';
import odooApi from '@/api/odoo-api';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import EPP from '../../inventario/tabla_productos';
import { useAlmacen } from '../../contexto/contexto';
import { useAsyncList } from "@react-stately/data";

const ViajeEPP = ({ id_viaje }) => {
  console.log(id_viaje);
  const {
    modoEdicion, setModoEdicion,
    data, setData,
    isDisabled, setDisabled
  } = useAlmacen();

  const [open, setOpen] = useState(false);
  const viajePorDefectoId = id_viaje;
  const [selectedKey, setSelectedKey] = useState(viajePorDefectoId);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dataViaje, setDataViaje] = useState([]);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    fetchDataById(selectedKey);
  };

  const fetchDataById = async (id) => {
    if (!id) return;
    try {
      const response = await odooApi.get(`/tms_waybill/get_by_id/${id}`);
      const item = response.data?.[0];
      if (item) setDataViaje(item);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const list = useAsyncList({
    async load({ signal, filterText }) {
      let items = [];

      if (filterText) {
        try {
          const res = await odooApi.get(`/tms_waybill/name/${filterText}`);
          items = res.data || [];
        } catch (error) {
          console.error("Error buscando viajes por nombre:", error);
        }
      }

      // ✅ Agrega el viaje por defecto solo si es válido y aún no está incluido
      if (!filterText && viajePorDefectoId && !items.some((item) => item.id === viajePorDefectoId)) {
        try {
          const defaultRes = await odooApi.get(`/tms_waybill/get_by_id/${viajePorDefectoId}`);
          const defaultItem = defaultRes.data?.[0];
          if (defaultItem) {
            items.unshift(defaultItem);
          }
        } catch (error) {
          console.error("Error cargando el viaje por defecto:", error);
        }
      }

      return { items };
    },
  });

  const handleSelection = (key) => {
    const item = list.items.find((i) => i.id == key);
    if (item) {
      setSelectedKey(key);
      setSelectedItem(item);
      list.setFilterText(item.name); // actualiza el input visible
      setData((prev) => ({
        ...prev,
        x_waybill_id: key,
      }));
    }
  };

  useEffect(() => {
    const cargarViajeInicial = async () => {
      if (!viajePorDefectoId) return;

      try {
        const res = await odooApi.get(`/tms_waybill/get_by_id/${viajePorDefectoId}`);
        const item = res.data?.[0];
        if (item) {
          setSelectedItem(item);
          list.setFilterText(item.name);
          setDataViaje(item);
        }
      } catch (error) {
        console.error("Error cargando el viaje inicial:", error);
      }
    };

    cargarViajeInicial();
  }, [viajePorDefectoId]);

  // ✅ Nuevo useEffect para limpiar cuando id_viaje es null
  useEffect(() => {
    if (!id_viaje) {
      setSelectedKey(null);
      setSelectedItem(null);
      list.setFilterText('');
      setDataViaje([]);
      setData((prev) => ({
        ...prev,
        x_waybill_id: null,
      }));
    }
  }, [id_viaje]);

  useEffect(() => {
    if (selectedKey) {
      fetchDataById(selectedKey);
    }
  }, [selectedKey]);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
        <Autocomplete
          key={selectedKey ?? 'empty'} // Fuerza reinicio visual si se limpia
          selectedKey={selectedKey}
          onSelectionChange={handleSelection}
          inputValue={list.filterText}
          onInputChange={list.setFilterText}
          isLoading={list.isLoading}
          items={list.items}
          label="Carta porte"
          placeholder="Buscar referencia carta porte"
          variant="bordered"
          isDisabled={!modoEdicion}
        >
          {(item) => (
            <AutocompleteItem key={item.id} className="capitalize">
              {item.name}
            </AutocompleteItem>
          )}
        </Autocomplete>
      </div>
    </div>
  );
};

export default ViajeEPP;
