import { Button } from "@heroui/react";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { TextareaInput } from "@/components/inputs";

type CancelarFolio = {
    comentarios: string
}

const initialForm: CancelarFolio = {
    comentarios: ""
}

const CancelDescuento = ({ open, onClose, id }: { open: boolean, onClose: () => void, id: number }) => {

    const { control, handleSubmit, reset } = useForm<CancelarFolio>({
        defaultValues: initialForm,
    });

    const handleCancel = (data: CancelarFolio) => {
        odooApi.patch(`/descuentos/estado/${id}/cancelado`, null,
            {
                params: {
                    comentarios: data.comentarios
                }
            })
            .then(response => {
                if (response.data.status == "success") {
                    toast.success(response.data.message);
                    reset(initialForm);
                    onClose();
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((error: any) => {
                toast.error(
                    error.response?.data?.detail ||
                    "Error, hubo un problema al cancelar el folio."
                );
            });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            sx={{
                zIndex: 2000,
                "& .MuiDialog-container": {
                    zIndex: 2000,
                },
            }}>
            <DialogTitle>
                ¿Deseas cancelar este descuento?
            </DialogTitle>
            <DialogContent>
                <TextareaInput
                    control={control}
                    name="comentarios"
                    className="mt-3"
                    label="Comentarios cancelación"
                    variant="bordered"
                    rules={{ required: "Campo obligatorio" }}
                />
            </DialogContent>
            <DialogActions>
                <Button onPress={onClose} radius="md" size="sm">Cerrar</Button>
                <Button onPress={() => handleSubmit(handleCancel)()} color="danger" radius="md" size="sm">
                    Sí, Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CancelDescuento;
