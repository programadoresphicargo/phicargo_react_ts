import {
    Input, Progress, Button, Card, CardBody
} from "@heroui/react";
import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import odooApi from '@/api/odoo-api';
import toast from 'react-hot-toast';
import EPPSolicitados from "./epps_solicitud/epps";
import ViajeEPP from "./viaje/viaje";
import { Stack } from "@mui/material";
import { useAlmacen } from "../contexto/contexto";

const SolicitudForm = ({ id_solicitud, open, handleClose, onSaveSuccess }) => {
    const [data, setData] = useState({ nombre: '' });
    const [isLoading, setLoading] = useState(false);
    const [isSaving, setSaving] = useState(false);
    const
        { epp, setEPP,
            eppAdded, setEPPAdded,
            eppRemoved, setEPPRemoved,
            eppUpdated, setEPPUpdated
        } = useAlmacen();

    const fetchData = async () => {
        if (!id_solicitud) return;
        try {
            setLoading(true);
            const response = await odooApi.get(`/tms_travel/solicitudes_epp/id_solicitud/${id_solicitud}`);
            setData(response.data);
            setEPP(response.data.epp);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (id_solicitud === null) {
                const payload = {
                    data: {
                        id_viaje: 74566,
                    },
                    epp: eppAdded
                };

                const response = await odooApi.post('/tms_travel/solicitudes_epp/', payload);
                if (response.data.status == 'success') {
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            } else {
                const payload = {
                    data: {
                        id_viaje: 74566,
                    },
                    eppAdded: eppAdded,
                    eppRemoved: eppRemoved,
                    eppUpdated: eppUpdated
                };
                const response = await odooApi.put(`/tms_travel/solicitudes_epp/${id_solicitud}`, payload);
                if (response.data.status == 'success') {
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            }
            setEPPAdded([]);
            setEPPRemoved([]);
            handleClose();
        } catch (error) {
            toast.error('Error al guardar:', error);
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (open && id_solicitud !== null) {
            fetchData();
        } else if (open && id_solicitud === null) {
            setData({ nombre: '' });
        }
    }, [open, id_solicitud]);

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth sx={{
            '& .MuiPaper-root': {
                borderRadius: '25px',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.0)',
            },
        }}
            BackdropProps={{
                sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                },
            }}>
            <DialogTitle>{id_solicitud ? `Editar solicitud (ID: ${id_solicitud})` : 'Nueva solicitud :)'}</DialogTitle>

            {isLoading ? (
                <Progress isIndeterminate size="sm" />
            ) : (
                <DialogContent>
                    <DialogContentText>

                        <Stack spacing={1} direction="row">
                            <Button
                                onPress={handleSave}
                                color={id_solicitud ? 'success' : 'primary'}
                                isDisabled={isSaving}
                                className={id_solicitud ? 'text-white' : ''}
                            >
                                {isSaving ? 'Guardando...' : id_solicitud ? 'Actualizar' : 'Registrar'}
                            </Button>
                            <Button color='success' className='text-white'>Confirmar</Button>
                            <Button color='warning' className="text-white">Salida de equipo</Button>
                            <Button color='danger'>Responsiva</Button>
                            <Button color='danger'>Cancelar</Button>
                        </Stack>

                        <Card className="mt-5">
                            <CardBody>
                                <ViajeEPP></ViajeEPP>
                            </CardBody>
                        </Card>

                        <Card className="mt-5">
                            <CardBody>
                                <EPPSolicitados></EPPSolicitados>
                            </CardBody>
                        </Card>

                    </DialogContentText>
                </DialogContent>
            )}

            <DialogActions>
                <Button onPress={handleClose}>Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SolicitudForm;
