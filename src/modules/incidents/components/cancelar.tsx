import { Button, Textarea } from "@heroui/react";
import { AppBar, Dialog, DialogActions, DialogContent, IconButton, Toolbar, Typography } from "@mui/material";
import { useCreateIncidentForm } from "../hooks/useCreateIncidentForm";
import { useState } from "react";
import { CloseIcon } from "yet-another-react-lightbox";

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
            <AppBar position="static" elevation={0} color="transparent">
                <Toolbar>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            fontSize: "1rem",
                            flexGrow: 1,
                            fontFamily: "Inter"
                        }}
                    >
                        ¿Deseas cancelar este registro?
                    </Typography>

                    <IconButton
                        edge="end"
                        onClick={onClose}
                        color="inherit"
                        aria-label="Cerrar"
                    >
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
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
