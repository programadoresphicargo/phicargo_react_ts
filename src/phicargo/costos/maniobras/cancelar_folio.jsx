import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useContext, useState } from "react";

import { CostosExtrasContext } from "../context/context";
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";

const CancelFolio = ({ open, onClose, fetchData }) => {

    const { id_folio, setIDFolio, CartasPorte, CartasPorteEliminadas, CostosExtras, setCostosExtras, CostosExtrasEliminados, setCostosExtrasEliminados, formData, setFormData, DisabledForm, setDisabledForm } = useContext(CostosExtrasContext);
    const [motivo_cancelacion, setMC] = useState("");
    const [comentarios_cancelacion, setCC] = useState("");

    const reasons = [
        "Error en los datos",
        "Unidad no llego a tiempo a planta",
        "Refacturación",
        "Otros",
    ];

    const handleCancel = () => {
        odooApi.post(`/folios_costos_extras/cancelar/`, {
            id_folio: id_folio,
            motivo_cancelacion: motivo_cancelacion,
            comentarios_cancelacion: comentarios_cancelacion
        })
            .then(response => {
                fetchData();
                toast.success("El folio ha sido cancelado.");
                setMC("");
                setCC("");
                onClose();
            })
            .catch(error => {
                toast.error("Error, hubo un problema al cancelar el folio: " + error);
            });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>
                <p>¿Deseas cancelar este folio?</p>
            </DialogTitle>
            <DialogContent>

                <Select
                    label="Motivo de cancelación"
                    value={motivo_cancelacion}
                    variant="bordered"
                    onChange={(e) => setMC(e.target.value)}
                    fullWidth
                >
                    {reasons.map((reason, index) => (
                        <SelectItem key={reason} value={reason}>
                            {reason}
                        </SelectItem>
                    ))}
                </Select>

                <Textarea
                    className="mt-3"
                    fullWidth
                    label="Comentarios cancelación"
                    variant="bordered"
                    value={comentarios_cancelacion}
                    onChange={(e) => setCC(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onPress={onClose} color="error">Cancelar</Button>
                <Button onPress={handleCancel} color="danger" isDisabled={!motivo_cancelacion.trim() || !comentarios_cancelacion.trim()}>
                    Sí, cancelar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CancelFolio;
