import {
 Dialog,
 DialogTitle,
 DialogContent,
 DialogActions,
} from "@mui/material";
import { Button } from "@heroui/react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import odooApi from "@/api/odoo-api";

export const status = [
 { label: "SIN MANIOBRA", key: "sm" },
 { label: "EN PROCESO DE INGRESO", key: "EI" },
 { label: "PATIO MÉXICO", key: "pm" },
 { label: "REUTILIZADO", key: "ru" },
 { label: "EN TERRAPORTS", key: "T" },
 { label: "EN VIAJE", key: "V" },
 { label: "EN PATIO", key: "P" },
];

const ContenedorEdit = ({ open, onClose, data }) => {
 const [selectedKey, setSelectedKey] = useState("");
 const [isLoading, setLoading] = useState(false);

 useEffect(() => {
  if (data?.x_status_bel) {
   setSelectedKey(String(data.x_status_bel));
  }
 }, [data]);

 const Save = async () => {
  setLoading(true);
  try {
   const response = await odooApi.put(
    `/tms_waybill/${data.id}`,
    { x_status_bel: selectedKey }
   );
   if (response.data.status == "success") {
    toast.success(response.data.message);
   } else {
    toast.error(response.data);
   }
   onClose();
  } catch (error) {
   toast.error("Error al guardar el estatus");
  } finally {
   setLoading(false);
  }
 };

 return (
  <Dialog open={open} onClose={onClose}>
   <DialogTitle>Contenedor: {data?.x_reference}</DialogTitle>

   <DialogContent>
    <Autocomplete
     defaultSelectedKey={String(selectedKey)}
     selectedKey={String(selectedKey)}
     className="max-w-xs"
     defaultItems={status}
     label="Estatus"
     placeholder="Selecciona estatus"
     onSelectionChange={setSelectedKey}
     disabledKeys={["P", "V"]}
    >
     {(item) => (
      <AutocompleteItem key={item.key}>
       {item.label}
      </AutocompleteItem>
     )}
    </Autocomplete>
   </DialogContent>

   <DialogActions>
    <Button onPress={onClose} radius="full">
     Cancelar
    </Button>

    <Button
     onPress={Save}
     color="primary"
     radius="full"
     isLoading={isLoading}
    >
     Aceptar
    </Button>
   </DialogActions>
  </Dialog>
 );
};

export default ContenedorEdit;
