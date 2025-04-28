import { Button, Input } from "@heroui/react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';

import axios from 'axios';
import odooApi from '@/api/odoo-api';
const { VITE_PHIDES_API_URL } = import.meta.env;

function FormularioTerminales({ open, onClose, id_terminal }) {

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        id_terminal: id_terminal,
        terminal: '',
    });

    useEffect(() => {
        const fetchTerminalData = async () => {
            try {
                toast.info('Obteniendo terminal...');
                setIsLoading(true);
                const response = await odooApi.get('/maniobras/terminales/by_id_terminal/' + id_terminal);
                const data = response.data;

                setFormData(prevState => ({
                    ...prevState,
                    id_terminal: id_terminal,
                    terminal: data?.terminal || "",  // Si no existe terminal, pon ""
                }));

            } catch (error) {
                console.error("Error al obtener los datos del terminal:", error);

                // También podrías resetear en caso de error
                setFormData(prevState => ({
                    ...prevState,
                    id_terminal: id_terminal,
                    terminal: "",
                }));

            } finally {
                setIsLoading(false);
            }
        };

        if (id_terminal !== 0) {
            fetchTerminalData();
        } else {
            // Si id_terminal es 0, resetea el formulario también
            setFormData(prevState => ({
                ...prevState,
                id_terminal: 0,
                terminal: "",
            }));
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
        setIsLoading(true);
        odooApi.post('/maniobras/terminales/update/' + id_terminal, formData)
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                }
                setIsLoading(false);
            })
            .catch(error => {
                toast.error('Error:' + error);
                setIsLoading(false);
            });
    };

    const registrar = () => {
        if (formData.terminal === "") {
            return toast.error("Ingresa un valor para terminal");
        }
        console.log(formData);
        odooApi.post('/maniobras/terminales/create/', formData)
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    onClose();
                } else if (response.data.status === "error") {
                    toast.error(response.data.message);
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
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth="sm"
                maxWidth="sm"
            >
                <DialogTitle></DialogTitle>
                <DialogContent>
                    <DialogContentText>

                        <div className="flex flex-wrap gap-2 items-center mb-3">
                            {id_terminal === 0 && (
                                <Button type="button" color="primary" onPress={registrar} isLoading={isLoading}>Guardar</Button>
                            )}
                            {id_terminal !== 0 && (
                                <Button
                                    type="button"
                                    color="success"
                                    onPress={actualizar}
                                    isLoading={isLoading}
                                    className="text-white"
                                >
                                    Actualizar
                                </Button>
                            )}
                        </div>

                        <Input
                            label='Nombre terminal'
                            variant="bordered"
                            type="text"
                            id="terminal"
                            name="terminal"
                            value={formData.terminal}
                            onChange={handleInputChange}
                        />

                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default FormularioTerminales;
