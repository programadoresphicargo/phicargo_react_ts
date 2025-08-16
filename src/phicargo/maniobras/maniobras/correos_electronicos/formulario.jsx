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

const FormularioCorreo = ({ open, handleClose }) => {

    const { id_maniobra, id_cliente, formData, setFormData, formDisabled, setFormDisabled } = useContext(ManiobraContext);
    const [nombreCompleto, setNombreCompleto] = React.useState('');
    const [correo, setCorreo] = React.useState('');
    const [tipoCorreo, setTipoCorreo] = React.useState('Destinatario');

    const handleSubmit = async () => {
        try {
            const response = await odooApi.post("/correos/crear_correo/", {
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
                <DialogTitle>Nuevo correo electrónico</DialogTitle>
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
                    />
                    <Spacer y={1} />
                    <Select
                        label="Tipo de correo"
                        placeholder="Select an animal"
                        selectedKeys={[tipoCorreo]}
                        variant="bordered"
                        onChange={(e) => setTipoCorreo(e.target.value)}
                    >
                        <SelectItem key={"Destinatario"}>Destinatario</SelectItem>
                        <SelectItem key={"CC"}>CC</SelectItem>
                    </Select>

                </DialogContent>
                <DialogActions>
                    <Button onPress={handleClose} color='danger'>Cancelar</Button>
                    <Button type="submit" color='primary' onPress={handleSubmit}>Registrar</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default FormularioCorreo;
