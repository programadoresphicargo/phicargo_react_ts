import { Box, Grid, Typography } from '@mui/material';
import { Button, Textarea } from '@heroui/react';
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
import { styled } from '@mui/system';
import { toast } from 'react-toastify';
import { useAuthContext } from "@/modules/auth/hooks";
import { useDropzone } from 'react-dropzone';
const { VITE_PHIDES_API_URL } = import.meta.env;

export default function PanelEstatus({ id_maniobra, open, handleClose }) {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingEnvio, setIsLoadingEnvio] = useState(false);
    const [estatus_seleccionado, setEstatusSeleccionado] = useState(null);
    const [comentarios, setComentarios] = useState('');
    const [files, setFiles] = useState([]);

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

    const onDrop = useCallback((acceptedFiles) => {
        setFiles((prevFiles) => [
            ...prevFiles,
            ...acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            ),
        ]);
    }, []);

    const removeFile = (fileName) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    };

    const enviar_estatus = async () => {

        if (estatus_seleccionado == null) {
            toast.error('Por favor selecciona un estatus.');
            return;
        }

        const formData = new FormData();
        formData.append('id_maniobra', id_maniobra);
        formData.append('id_estatus', estatus_seleccionado);
        formData.append('comentarios', comentarios);
        files.forEach((file) => formData.append('file[]', file));
        setIsLoadingEnvio(true);

        try {
            toast.info('Enviando correo espere...');
            const response = await axios.post(VITE_PHIDES_API_URL + '/modulo_maniobras/panel_envio/guardar_estatus.php', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = response.data;

            if (data.success) {
                toast.success(data.message);
                setEstatusSeleccionado(null);
                setComentarios('');
                setFiles([]);
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

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*', // Aceptar solo imágenes
        multiple: true, // Permitir múltiples archivos
    });

    const thumbs = files.map((file) => (
        <div key={file.name} style={{ margin: '10px' }}>
            <Card sx={{ maxWidth: 120 }}>
                <CardMedia
                    component="img"
                    alt={file.name}
                    height="140"
                    width="140"
                    image={file.preview}
                />
                <CardContent>
                    <Button variant="text" onClick={() => removeFile(file.name)}>Borrar</Button>
                </CardContent>
            </Card>
        </div>
    ));

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
                    <div
                        {...getRootProps()}
                        style={{
                            border: '2px dashed #ccc',
                            padding: '20px',
                            textAlign: 'center',
                            cursor: 'pointer',
                        }}
                    >
                        <input {...getInputProps()} />
                        <p>Arrastra y suelta algunos archivos aquí, o haz clic para seleccionarlos</p>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>{thumbs}</div>

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