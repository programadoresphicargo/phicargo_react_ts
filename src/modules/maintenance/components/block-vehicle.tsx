import odooApi from "@/api/odoo-api";
import { TextareaInput } from "@/components/inputs";
import { Button } from "@heroui/react";
import {
 Dialog,
 DialogTitle,
 DialogContent,
 DialogActions,
 Divider,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MaintenanceRecord } from "../models";

interface Props {
 open: boolean;
 onClose: () => void;
 onCloseDialog: () => void;
 record: MaintenanceRecord;
 action: string;
}

type CommentCreate = {
 comment_text: string;
}

export default function BlockVehicleDialog({ open, onClose, onCloseDialog, record, action }: Props) {

 const [isLoading, setLoading] = useState<boolean>(false);

 const initialForm: CommentCreate = {
  comment_text: ""
 }

 const {
  control,
  handleSubmit,
  reset,
 } = useForm<CommentCreate>({
  defaultValues: initialForm,
 });

 const onSubmit = async (dataComment: CommentCreate) => {
  try {
   setLoading(true);
   let data;
   if (action == "block") {
    data = { "state_id": 10 };
   } else {
    data = { "state_id": 1 };
   }
   const res = await odooApi.patch(`/vehicles/${record.vehicle.id}`, data);
   if (typeof res.data === "object" && res.data !== null) {
    toast.success("Estado actualizado.");
    await odooApi.post(`/maintenance-record/${record.id}/comments`, dataComment);
    onCloseDialog();
    reset(initialForm);
   }
  } catch (error: any) {
   const detail =
    error.response?.data?.detail || error.message;
   toast.error("Error: " + detail);
  } finally {
   setLoading(false);
  }
 };

 return (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
   <DialogTitle>{action == "block" ? "Bloquear equipo (No apto para uso)" : "Equipo apto para uso"}</DialogTitle>
   <Divider></Divider>
   <DialogContent>
    <TextareaInput control={control} name="comment_text" label="Comentarios" rules={{ required: "Campo obligatorio" }}></TextareaInput>
   </DialogContent>

   <DialogActions>
    <Button onPress={onClose} radius="full">
     Cancelar{record.vehicle.state_id}
    </Button>

    <Button color={action == "block" ? "danger" : "success"} className="text-white" radius="full" onPress={() => handleSubmit(onSubmit)()} isLoading={isLoading}>
     {action == "block" ? "Bloquear equipo" : "Desbloquear"}
    </Button>
   </DialogActions>
  </Dialog>
 );
}