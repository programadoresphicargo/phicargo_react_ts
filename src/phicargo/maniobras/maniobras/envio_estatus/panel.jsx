import { Box, Grid, Typography } from '@mui/material';
import { Button, Textarea, user } from '@heroui/react';
import { Card, CardBody, CardFooter } from "@heroui/react";
import React, { useCallback, useEffect, useState } from 'react';

import CardMedia from '@mui/material/CardMedia';
import { CircularProgress } from "@heroui/react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { useAuthContext } from "@/modules/auth/hooks";
import { Upload, message } from 'antd';

const { Dragger } = Upload;

export default function PanelEstatus({ id_maniobra, open, handleClose }) {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingEnvio, setIsLoadingEnvio] = useState(false);
    const [estatus_seleccionado, setEstatusSeleccionado] = useState(null);
    const [comentarios, setComentarios] = useState('');
    const [fileList, setFileList] = useState([]);
    const { session } = useAuthContext();

    const handleSelectCard = (id) => {
        setEstatusSeleccionado(id);
    };

    const handleComentariosChange = (event) => {
        setComentarios(event.target.value);
    };

    useEffect(() => {
        setIsLoading(true);
        odooApi.get('/estatus_operativos/tipo/maniobra/monitoreo')
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error('Error al obtener datos:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [open]);

    const handleCardClick = (id) => {
        setSelectedCard(id);
    };

    const props = {
        name: 'file',
        multiple: true,
        onChange(info) {
            setFileList(info.fileList);
        },
        beforeUpload: (file) => {
            setFileList((prevFileList) => [...prevFileList, file]);
            return false;
        },
        fileList,
        onRemove: (file) => {
            setFileList((prevFileList) => prevFileList.filter((f) => f.uid !== file.uid));
        },
    };

    const enviar_estatus = async () => {

        if (estatus_seleccionado == null) {
            toast.error('Por favor selecciona un estatus.');
            return;
        }

        const formData = new FormData();
        formData.append('id_maniobra', id_maniobra);
        formData.append('id_estatus', estatus_seleccionado);
        formData.append('id_usuario', session.user.id);
        formData.append('comentarios', comentarios);
        fileList.forEach((fileWrapper) => {
            if (fileWrapper.originFileObj instanceof File) {
                formData.append('files', fileWrapper.originFileObj);
            }
        });
        setIsLoadingEnvio(true);

        try {
            toast.info('Enviando correo espere...');
            const response = await odooApi.post('/maniobras/reportes_estatus_maniobras/envio_estatus/', formData);
            const data = response.data;

            if (data.status == "success") {
                toast.success(data.message);
                setEstatusSeleccionado(null);
                setComentarios('');
                setFileList([]);
                handleClose();
            } else {
                toast.error(data.message);
            }

            setIsLoadingEnvio(false);

        } catch (error) {
            setIsLoadingEnvio(false);
            toast.error('Error enviando el archivo' + error);
        }
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth={'lg'}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Envio estatus"}
                </DialogTitle>
                <DialogContent>

                    <Typography variant="h5" gutterBottom>
                        Seleccionar estatus
                    </Typography>

                    <Box>
                        <div className="gap-4 grid grid-cols-2 sm:grid-cols-4 p-4">
                            {data.map((item, index) => (
                                <Card shadow="sm" key={index} isPressable
                                    onPress={() => handleSelectCard(item.id_estatus)}
                                    style={{
                                        border: estatus_seleccionado === item.id_estatus ? '2px solid blue' : 'none',
                                    }}>
                                    <CardBody className="overflow-visible flex items-center justify-center">
                                    </CardBody>
                                    <CardFooter className="text-small justify-center">
                                        <b>{item.nombre_estatus}</b>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </Box>

                    <Typography variant="h5" gutterBottom className='mt-5'>
                        Evidencias
                    </Typography>

                    <Dragger {...props} style={{ fontFamily: 'Inter' }}>
                        <p className="ant-upload-drag-icon"></p>
                        <p className="ant-upload-text">Haz clic o arrastra el archivo aquí para subirlo</p>
                        <p className="ant-upload-hint">Soporta múltiples archivos</p>
                    </Dragger>

                    <Textarea
                        fullWidth
                        label="Comentarios"
                        id="comentarios_estatus"
                        variant='bordered'
                        value={comentarios}
                        onChange={handleComentariosChange}
                        className='mt-5'
                    />

                </DialogContent>
                <DialogActions>
                    <Button onPress={handleClose} color='danger'>Cancelar</Button>
                    <Button onPress={enviar_estatus} color='primary' isLoading={isLoadingEnvio}>
                        Enviar estatus
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}