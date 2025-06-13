import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Input, Popover, PopoverContent, PopoverTrigger, User, useDisclosure } from "@heroui/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Avatar } from "@heroui/react";
import { Box, Stack } from '@mui/material';
import { Button } from "@heroui/react"
import { Chip } from "@heroui/react";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Slide from '@mui/material/Slide';
import odooApi from '@/api/odoo-api';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import EPP from '../../inventario/tabla';
import { useAlmacen } from '../../contexto/contexto';
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useAsyncList } from "@react-stately/data";

const ViajeEPP = ({ id_viaje }) => {
  const
    { modoEdicion, setModoEdicion,
      data, setData, epp, setEPP,
      eppAdded, setEPPAdded,
      eppRemoved, setEPPRemoved,
      eppUpdated, setEPPUpdated,
      isDisabled, setDisabled
    } = useAlmacen();
  const [id_solicitud, setIDSolicitud] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const viajePorDefectoId = id_viaje;
  const [selectedKey, setSelectedKey] = useState(viajePorDefectoId);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const [dataViaje, setDataViaje] = useState([]);

  const fetchData = async (id) => {
    try {
      const response = await odooApi.get('/tms_waybill/get_by_id/' + id);
      setDataViaje(response.data[0]);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    const cargarViajeInicial = async () => {
      if (viajePorDefectoId) {
        const res = await odooApi.get(`/tms_waybill/get_by_id/${viajePorDefectoId}`);
        const item = res.data[0];
        setSelectedItem(item);
        list.setFilterText(item.name);
        setDataViaje(item);
      }
    };
    cargarViajeInicial();
  }, [viajePorDefectoId]);

  useEffect(() => {
    if (selectedKey) {
      fetchData(selectedKey);
    }
  }, [selectedKey]);

  const list = useAsyncList({
    async load({ signal, filterText }) {
      const res = await odooApi.get(`/tms_waybill/name/${filterText}`);
      const items = res.data;

      // Asegura que el item por defecto esté incluido
      if (!filterText && !items.some((item) => item.id === viajePorDefectoId)) {
        const defaultRes = await odooApi.get(`/tms_waybill/get_by_id/${viajePorDefectoId}`);
        items.unshift(defaultRes.data[0]);
      }

      return { items };
    },
  });

  const handleSelection = (key) => {
    const item = list.items.find((i) => i.id == key);
    if (item) {
      setSelectedKey(key);
      setSelectedItem(item);
      list.setFilterText(item.name); // Actualiza el input visible
      fetchData(key);
      setData((prev) => ({
        ...prev,
        x_waybill_id: key,
      }));
    }
  };

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">

          <Autocomplete
            selectedKey={selectedKey}
            onSelectionChange={handleSelection}
            inputValue={list.filterText}
            onInputChange={list.setFilterText}
            isLoading={list.isLoading}
            items={list.items}
            label="Carta porte"
            placeholder="Buscar referencia carta porte"
            variant="faded"
            className="max-w-xs"
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

    </>
  );
};

export default ViajeEPP;
