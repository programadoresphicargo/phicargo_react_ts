import { Button, Input } from "@heroui/react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';

import axios from 'axios';
import odooApi from '@/api/odoo-api';
const { VITE_PHIDES_API_URL } = import.meta.env;

function FormularioTerminales({ open, onClose, id_terminal }) {

    const [formData, setFormData] = useState({
        id_terminal: id_terminal,
        terminal: '',
    });

    useEffect(() => {
        const fetchVehiculoData = async () => {
            try {
                const response = await odooApi.get('/terminales_maniobras/by_id_terminal/' + id_terminal);
                const data = response.data[0];
                setFormData(prevState => ({
                    ...prevState,
                    id_terminal: id_terminal,
                    terminal: data.terminal,
                }));
            } catch (error) {
                console.error("Error al obtener los datos del terminal:", error);
            }
        };

        if (id_terminal !== 0) {
            fetchVehiculoData();
        }
    }, [id_terminal]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const actualizar = () => {
        console.log(formData);
        axios.post(VITE_PHIDES_API_URL + '/modulo_maniobras/terminales/actualizar_terminal.php', formData)
            .then(response => {
                console.log('Respuesta del servidor:', response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const registrar = () => {
        console.log(formData);
        axios.post(VITE_PHIDES_API_URL + '/modulo_maniobras/terminales/registrar_terminal.php', formData)
            .then(response => {
                var data = response.data;
                if (data.success) {
                    toast.success('Terminal registrada');
                    onClose();
                } else {
                    toast.error(data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div>
            <Dialog open={open} onClose={onClose}
                fullWidth="sm"
                maxWidth="sm">
                <DialogTitle></DialogTitle>
                <DialogContent>
                    <DialogContentText>

                        <form id="formpostura">
                            <Button type="button" color="primary" onPress={registrar}>Guardar</Button>
                            <Input
                                label='Nombre terminal'
                                variant="bordered"
                                type="text"
                                className="form-control"
                                id="terminal"
                                name="terminal"
                                value={formData.terminal}
                                onChange={handleInputChange} />
                        </form>

                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default FormularioTerminales;
