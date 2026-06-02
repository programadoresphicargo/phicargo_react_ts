import { Button } from "@heroui/react";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { AutocompleteInput, TextareaInput } from "@/components/inputs";

type CancelarFolio = {
    motivo_cancelacion: string;
    comentarios_cancelacion: string
}

const initialForm: CancelarFolio = {
    motivo_cancelacion: "",
    comentarios_cancelacion: ""
}

const CancelFolio = ({ open, onClose, id_folio }: { open: boolean, onClose: () => void, id_folio: number }) => {

    const { control, handleSubmit, reset } = useForm<CancelarFolio>({
        defaultValues: initialForm,
    });

    const reasons = [
        { key: "Error en los datos", value: "Error en los datos" },
        { key: "Unidad no llego a tiempo a planta", value: "Unidad no llego a tiempo a planta" },
        { key: "Refacturación", value: "Refacturación" },
        { key: "Otros", value: "Otros" },
    ];

    const handleCancel = (data: CancelarFolio) => {
        odooApi.post(`/folios_costos_extras/cancelar/`, {
            id_folio: id_folio,
            motivo_cancelacion: data.motivo_cancelacion,
            comentarios_cancelacion: data.comentarios_cancelacion
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
            .catch(error => {
                toast.error("Error, hubo un problema al cancelar el folio: " + error);
            });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>
                ¿Deseas cancelar este folio?
            </DialogTitle>
            <DialogContent>
                <AutocompleteInput
                    control={control}
                    name="motivo_cancelacion"
                    label="Motivo de cancelación"
                    variant="bordered"
                    items={reasons}
                    rules={{ required: "Campo obligatorio" }}
                />
                <TextareaInput
                    control={control}
                    name="comentarios_cancelacion"
                    className="mt-3"
                    label="Comentarios cancelación"
                    variant="bordered"
                    rules={{ required: "Campo obligatorio" }}
                />
            </DialogContent>
            <DialogActions>
                <Button onPress={onClose} radius="full">Cerrar</Button>
                <Button onPress={() => handleSubmit(handleCancel)()} color="danger" radius="full">
                    Sí, Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CancelFolio;
