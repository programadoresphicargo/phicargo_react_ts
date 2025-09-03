import { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, IconButton, Stack, Typography, Checkbox
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Input, Select, SelectItem } from '@heroui/react';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';

const tiposCanal = [
    { value: 'email', label: 'Correo electrónico' },
    { value: 'whatsapp', label: 'WhatsApp' },
];

export default function RegistrarContactoDialog({ open, onClose, onSubmit }) {

    const [isLoading, setLoading] = useState(false);

    const [contacto, setContacto] = useState({
        nombre: '',
        id_cliente: '1',
    });

    const [canales, setCanales] = useState([
        { tipo: 'email', valor: '' },
    ]);

    const handleContactoChange = (e) => {
        const { name, value } = e.target;
        setContacto(prev => ({ ...prev, [name]: value }));
    };

    const handleCanalChange = (index, field, value) => {
        const nuevosCanales = [...canales];
        nuevosCanales[index][field] = value;
        setCanales(nuevosCanales);
    };

    const agregarCanal = () => {
        setCanales([...canales, { tipo: 'email', valor: '' }]);
    };

    const eliminarCanal = (index) => {
        setCanales(canales.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (canales.length === 0) {
            toast.error("Debes añadir al menos un canal de comunicaciòn")
        }

        try {
            setLoading(true);
            const payload = {
                contacto: contacto,
                canales_contacto: canales
            };

            const response = await odooApi.post('/contactos_clientes/', payload);
            if (response.data.status == "success") {
                toast.success(response.data.message);
                onClose();
                setContacto({
                    nombre: '',
                    id_cliente: '1',
                });
                setCanales([]);
            } else {
                toast.error(response.data.message);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle
                className="bg-primary"
                sx={{
                    color: 'white',
                }}>Registrar nuevo contacto
            </DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2}>
                    <Input
                        label="Nombre del contacto"
                        name="nombre"
                        variant='bordered'
                        value={contacto.nombre}
                        onChange={handleContactoChange}
                        fullWidth
                    />

                    <Typography variant="subtitle1">Canales de contacto</Typography>

                    {canales.map((canal, index) => (
                        <Stack direction="row" spacing={2} key={index} alignItems="center">
                            <Select
                                variant="bordered"
                                label="Tipo"
                                value={canal.tipo}
                                onChange={(e) => handleCanalChange(index, 'tipo', e.target.value)}
                                sx={{ width: 50 }}
                            >
                                {tiposCanal.map(op => (
                                    <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                                ))}
                            </Select>

                            <Input
                                label={canal.tipo === 'email' ? 'Correo' : 'Número'}
                                variant='bordered'
                                value={canal.valor}
                                onChange={(e) => handleCanalChange(index, 'valor', e.target.value)}
                                fullWidth
                            />

                            <IconButton onClick={() => eliminarCanal(index)} disabled={canales.length === 1}>
                                <DeleteIcon />
                            </IconButton>
                        </Stack>
                    ))}

                    <Button startContent={<AddIcon />} onPress={agregarCanal} color='primary'>
                        Agregar canal
                    </Button>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button color='primary' onPress={handleSubmit}>Guardar</Button>
                <Button onPress={onClose}>Cancelar</Button>
            </DialogActions>
        </Dialog>
    );
}
