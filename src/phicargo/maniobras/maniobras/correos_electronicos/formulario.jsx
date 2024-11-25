import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';

const FormularioCorreo = ({ open, handleClose, id_cliente }) => {
    // Estados para cada campo del formulario
    const [nombreCompleto, setNombreCompleto] = React.useState('');
    const [correo, setCorreo] = React.useState('');
    const [tipoCorreo, setTipoCorreo] = React.useState('');

    // Función para manejar el envío de los datos
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Crear un objeto FormData para enviar los datos como POST
        const formData = new FormData();
        formData.append('idcliente', id_cliente);
        formData.append('nombre', nombreCompleto);
        formData.append('correo', correo);
        formData.append('tipo', tipoCorreo);

        try {
            // Usar axios para enviar una solicitud POST con los datos de FormData
            const response = await axios.post('/phicargo/gestion_viajes/banco/consultas/ingresar_correo.php', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Respuesta del servidor:', response.data);
            handleClose();  // Cerrar el modal al enviar los datos
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: handleSubmit,  // Usar la función handleSubmit para el envío
                }}
            >
                <DialogTitle>Nuevo correo electrónico</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="nombre_completo"
                        label="Nombre completo del contacto"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={nombreCompleto}
                        onChange={(e) => setNombreCompleto(e.target.value)}
                    />
                    <TextField
                        required
                        margin="dense"
                        id="correo"
                        label="Correo electrónico"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                    />
                    <Select
                        className='mt-4'
                        variant="standard"
                        id="tipo_correo"
                        value={tipoCorreo}
                        onChange={(e) => setTipoCorreo(e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="destinatario">Destinatario</MenuItem>
                        <MenuItem value="cc">CC</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant='contained'>Cancelar</Button>
                    <Button type="submit" variant='contained'>Registrar</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default FormularioCorreo;
