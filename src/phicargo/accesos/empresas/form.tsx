import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { Button } from '@heroui/react';
import { Input } from '@heroui/react';
import { AppBar } from '@mui/material';
import { Toolbar } from '@mui/material';
import Typography from '@mui/material/Typography';

type Props = {
    open: boolean;
    handleClose: () => void;
};

const FormEmpresa: React.FC<Props> = ({ open, handleClose }) => {

    const [nombreEmpresa, setNombreEmpresa] = useState('');

    const handleChange = (e: any) => {
        const inputValue = e.target.value;

        // Validar que solo contenga letras y espacios
        if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(inputValue)) {
            setNombreEmpresa(inputValue);
        } else {
            toast.warn('Solo se permiten letras y espacios');
        }
    };

    const AñadirEmpresa = async () => {
        if (!nombreEmpresa.trim()) {
            toast.error('El nombre de la empresa no puede estar vacío.');
            return;
        }

        try {
            const response = await odooApi.post('/empresas_visitantes/', {
                empresa: nombreEmpresa.trim()
            });

            if (response.data.status == 'success') {
                toast.success(response.data.message);
                setNombreEmpresa('');
                handleClose();
            } else {
                toast.error(response.data.message);
            }
        } catch (error: any) {
            toast.error('Error en la solicitud: ' + error.message);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >
            <AppBar
                sx={{
                    background: 'linear-gradient(90deg, #0b2149, #002887)',
                    position: 'relative',
                    padding: '0 16px'
                }}
                elevation={0}>
                <Toolbar>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Nueva empresa
                    </Typography>
                </Toolbar>
            </AppBar>
            <DialogContent>
                <Input
                    id="nombre_empresa"
                    name="nombre_empresa"
                    label="Ingresa el nombre de la empresa"
                    fullWidth
                    variant="bordered"
                    value={nombreEmpresa}
                    onChange={handleChange} // Validación en tiempo real
                />
            </DialogContent>
            <DialogActions>
                <Button onPress={handleClose} radius='full'>Cancelar</Button>
                <Button onPress={AñadirEmpresa} color='primary' radius='full'>Registrar</Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormEmpresa;