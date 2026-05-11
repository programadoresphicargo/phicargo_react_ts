import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { toast } from 'react-toastify';
import odooApi from '@/api/odoo-api';
import { Button, Select, SelectItem, Textarea } from '@heroui/react';
import { useAlmacen } from '../contexto/contexto';
import { Controller, useForm } from 'react-hook-form';

type Cancelacion = {
    motivo_cancelacion: string;
    comentarios_cancelacion: string;
}

type Props = {
    open: boolean,
    onClose: () => void;
    id_solicitud?: number;
};

const CancelarSolicitudDialog: React.FC<Props> = ({
    open,
    onClose,
    id_solicitud
}) => {

    const {
        control,
        handleSubmit,
    } = useForm<Cancelacion>({
        defaultValues: {
            motivo_cancelacion: "",
            comentarios_cancelacion: "",
        },
    });

    const [loading, setLoading] = useState(false);
    const { fetchData } = useAlmacen();

    const handleCancel = async (data: Cancelacion) => {
        setLoading(true);
        try {
            const response = await odooApi.patch(`/tms_travel/solicitudes_equipo/cancelar/${id_solicitud}`, data);
            if (response.data.status === 'success') {
                toast.success(response.data.message);
                fetchData?.(id_solicitud);
                onClose();
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            toast.error('Error al cancelar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Cancelar solicitud</DialogTitle>
            <DialogContent dividers>
                <div className="my-3">
                    <Controller
                        control={control}
                        name="motivo_cancelacion"
                        rules={{ required: "Motivo es requerido" }}
                        render={({ field, fieldState }) => (
                            <Select
                                label="Motivo de cancelación"
                                placeholder="Selecciona un motivo"
                                selectedKeys={field.value ? [field.value] : []}
                                onSelectionChange={(keys) => {
                                    field.onChange(Array.from(keys)[0]);
                                }}
                                isInvalid={!!fieldState.error}
                                errorMessage={fieldState.error?.message}
                                variant="bordered"
                            >
                                <SelectItem key="error de captura">Error de captura</SelectItem>
                                <SelectItem key="solicitud duplicada">Solicitud duplicada</SelectItem>
                                <SelectItem key="operador no se presento">Operador no se presentó</SelectItem>
                                <SelectItem key="otro">Otro</SelectItem>
                            </Select>
                        )}
                    />
                </div>
                <div className="my-3">
                    <Controller
                        control={control}
                        name="comentarios_cancelacion"
                        rules={{ required: "Comentarios es requerido" }}
                        render={({ field, fieldState }) => (
                            <Textarea
                                label="Comentarios"
                                placeholder="Escribe un comentario"
                                minRows={3}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                isInvalid={!!fieldState.error}
                                errorMessage={fieldState.error?.message}
                                variant="bordered"
                            />
                        )}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    onPress={onClose}
                    disabled={loading}
                    radius='full'>
                    Cancelar
                </Button>
                <Button
                    radius='full'
                    onPress={() => handleSubmit(handleCancel)()}
                    color="danger"
                    isDisabled={loading}
                    isLoading={loading}
                >
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CancelarSolicitudDialog;
