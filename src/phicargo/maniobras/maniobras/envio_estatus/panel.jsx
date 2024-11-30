import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/system';
import CardMedia from '@mui/material/CardMedia';
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
const { VITE_PHIDES_API_URL } = import.meta.env;

const CustomCard = styled(Card)(({ isSelected }) => ({
    backgroundColor: isSelected ? '#b3e5fc' : '#ffffff',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    '&:hover': {
        backgroundColor: isSelected ? '#81d4fa' : '#f5f5f5',
    },
}));

export default function PanelEstatus({ id_maniobra, open, handleClose }) {

    const [data, setData] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [comentarios, setComentarios] = useState('');
    const [files, setFiles] = useState([]);

    const handleComentariosChange = (event) => {
        setComentarios(event.target.value);
    };

    useEffect(() => {
        axios.get(VITE_PHIDES_API_URL + '/modulo_maniobras/panel_envio/getEstatus.php')
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedCard == null) {
            toast.error('Por favor selecciona un estatus.');
        }

        const formData = new FormData();
        formData.append('id_maniobra', id_maniobra);
        formData.append('id_estatus', selectedCard);
        formData.append('comentarios', comentarios);
        files.forEach((file) => formData.append('file[]', file));

        try {
            toast.success('Enviando correo espere...');
            const response = await axios.post('/phicargo/modulo_maniobras/panel_envio/guardar_estatus.php', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const data = response.data;

            if (data.success) {
                toast.success(data.message);
                setSelectedCard(null);
                setComentarios('');
                setFiles([]);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error('Error subiendo el archivo', error);
            toast.error('Error subiendo el archivo' + error);
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

                    <Grid container spacing={2}>
                        {data.map((item) => (
                            <Grid item xs={12} sm={6} md={3} key={item.id}>
                                <CustomCard
                                    isSelected={selectedCard === item.id_estatus}
                                    onClick={() => handleCardClick(item.id_estatus)}
                                >
                                    <CardContent>
                                        <Typography variant="">{item.nombre_estatus}</Typography>
                                    </CardContent>
                                </CustomCard>
                            </Grid>
                        ))}
                    </Grid>

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

                    <Typography variant="h5" gutterBottom className='mt-5'>
                        Añadir comentarios
                    </Typography>
                    <TextField
                        fullWidth
                        label="Comentarios"
                        id="comentarios_estatus"
                        multiline
                        rows={4}
                        value={comentarios}
                        onChange={handleComentariosChange}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant='contained'>Cancelar</Button>
                    <Button onClick={handleSubmit} variant='contained'>
                        Enviar estatus
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}