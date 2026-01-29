import {
 Dialog,
 DialogTitle,
 DialogContent,
 DialogActions,
 Typography
} from "@mui/material";
import { Button } from "@heroui/react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import React, { useEffect, useMemo, useState } from 'react';
import toast from "react-hot-toast";
import odooApi from "@/api/odoo-api";

export const status = [
 { label: "SIN MANIOBRA", key: "sm" },
 { label: "EN PROCESO DE INGRESO", key: "EI" },
 { label: "PATIO MÉXICO", key: "pm" },
 { label: "REUTILIZADO", key: "ru" },
 { label: "EN TERRAPORTS", key: "T" },
 { label: "EN PATIO", key: "P" },
 { label: "EN VIAJE", key: "V" },
];

const ContenedorEdit = ({ open, onClose, data }) => {

 const [isLoading, setLoading] = useState(false);

 const Save = async () => {
  setLoading(true);
  try {
   const response = await odooApi.put(`/tms_waybill/${data.id}`, { "x_status_bel": "sm" });
   onClose();
  } catch (error) {
   toast.error('Error al obtener los datos:' + error);
  } finally {
   setLoading(false);
  }
 };

 return (
  <Dialog open={open} onClose={onClose}>
   <DialogTitle>{data?.x_reference}</DialogTitle>

   <DialogContent>
    <Autocomplete
     defaultSelectedKey={String(data?.x_status_bel)}
     selectedKey={String(data?.x_status_bel)}
     className="max-w-xs"
     defaultItems={status}
     label="Estatus"
     placeholder="Estatus"
    >
     {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
    </Autocomplete>
   </DialogContent>

   <DialogActions>
    <Button onPress={onClose} radius="full">
     Cancelar
    </Button>

    <Button onPress={() => Save()} color="primary" radius="full">
     Aceptar
    </Button>
   </DialogActions>
  </Dialog>
 );
};

export default ContenedorEdit;
