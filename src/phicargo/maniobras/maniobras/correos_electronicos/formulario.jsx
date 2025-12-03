import { Button, Input } from '@heroui/react';
import React, { useContext, useEffect, useState } from 'react';
import { Select, SelectItem, SelectSection } from "@heroui/react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { ManiobraContext } from '../../context/viajeContext';
import MenuItem from '@mui/material/MenuItem';
import { Spacer } from '@heroui/react';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";

const FormularioCorreo = ({ open, handleClose, id_cliente }) => {

    const { formDisabled, setFormDisabled } = useContext(ManiobraContext);
    const [nombreCompleto, setNombreCompleto] = React.useState('');
    const [correo, setCorreo] = React.useState('');
    const [tipoCorreo, setTipoCorreo] = React.useState('Destinatario');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let formErrors = {};

        if (!/^[A-Za-z\s]+$/.test(nombreCompleto)) {
            formErrors.nombreCompleto = "El nombre solo debe contener letras y espacios.";
        }

        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(correo)) {
            formErrors.correo = "El correo electrónico no tiene un formato válido.";
        }

        if (!tipoCorreo) {
            formErrors.tipoCorreo = "Debe seleccionar un tipo de correo.";
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async () => {

        if (!validateForm()) {
            toast.error("Hay errores en el formulario. Por favor, corrígelos antes de enviar.");
            return;
        }

        try {
            const response = await odooApi.post("/correos/", {
                id_cliente: id_cliente,
                nombre_completo: nombreCompleto,
                correo: correo,
                tipo: tipoCorreo
            });

            if (response.data.status === "success") {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }

            handleClose();
        } catch (error) {
            toast.error("Error al enviar los datos");
            console.error("Error:", error.response?.data || error);
        }
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth={true}
                maxWidth='sm'
            >
                <DialogTitle>Nuevo correo electrónico {id_cliente}</DialogTitle>
                <DialogContent>
                    <Input
                        margin="dense"
                        id="nombre_completo"
                        label="Nombre completo del contacto"
                        type="text"
                        fullWidth
                        variant="bordered"
                        value={nombreCompleto}
                        onChange={(e) => setNombreCompleto(e.target.value)}
                        isInvalid={errors.nombreCompleto ? true : false}
                        errorMessage={errors.nombreCompleto}
                    />
                    <Spacer y={1} />
                    <Input
                        id="correo"
                        label="Correo electrónico"
                        type="email"
                        fullWidth
                        variant="bordered"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        isInvalid={errors.correo ? true : false}
                        errorMessage={errors.correo}
                    />
                    <Spacer y={1} />
                    <Select
                        label="Tipo de correo"
                        placeholder="Seleccionar tipo de correo"
                        selectedKeys={[tipoCorreo]}
                        variant="bordered"
                        onChange={(e) => setTipoCorreo(e.target.value)}
                        isInvalid={errors.tipoCorreo ? true : false}
                        errorMessage={errors.tipoCorreo}
                    >
                        <SelectItem key={"Destinatario"}>Destinatario</SelectItem>
                        <SelectItem key={"CC"}>CC</SelectItem>
                    </Select>

                </DialogContent>
                <DialogActions>
                    <Button onPress={handleClose} color='danger' radius='full'>Cancelar</Button>
                    <Button type="submit" color='primary' onPress={handleSubmit} radius='full'>Registrar</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default FormularioCorreo;
