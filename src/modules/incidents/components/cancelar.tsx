import { Button, Textarea } from "@heroui/react";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useCreateIncidentForm } from "../hooks/useCreateIncidentForm";
import { useState } from "react";

const CancelarIncidenciaForm = ({ open, onClose, id }: { open: boolean, onClose: () => void, id: number }) => {

    const { cancelIncident } = useCreateIncidentForm({
        mode: "edit",
        onSuccess: () => {
            onClose();
        },
    });

    const [comentarios, setComentarios] = useState("");

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
                <Textarea
                    isRequired
                    className="mt-3"
                    label="Comentarios cancelación"
                    variant="bordered"
                    value={comentarios}
                    onValueChange={setComentarios}
                />
            </DialogContent>
            <DialogActions>
                <Button onPress={onClose} radius="md" size="sm">Cerrar</Button>
                <Button onPress={() => cancelIncident(id, comentarios)} color="danger" radius="md" size="sm">
                    Sí, Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CancelarIncidenciaForm;
