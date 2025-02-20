import React, { useState, useEffect, useMemo } from 'react';
import { TextField, MenuItem, InputLabel, FormControl, Grid, Grid2 } from "@mui/material";
import axios from "axios";
import { toast } from 'react-toastify';
import Stack from '@mui/material/Stack';
import odooApi from "../modules/core/api/odoo-api";
import { Input } from "@heroui/react";
import { Button } from "@heroui/react";
import { DatePicker, Select, SelectItem, Autocomplete, AutocompleteItem } from "@heroui/react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";

const ListadoCostosExtras = ({ id_cuenta, onClose }) => {
    const fechaActual = new Date().toISOString().split('T')[0];
    const [value, setValue] = React.useState(parseDate(fechaActual));
    const [empresas, setEmpresas] = React.useState([]);
    const [bancos, setBancos] = React.useState([]);

    const getCuentaByID = async () => {
        try {
            const response = await odooApi.get('/cuentas/get_cuenta_by_id/' + id_cuenta);
            const data = response.data
            setFormData((prevFormData) => ({
                ...prevFormData,
                id_empresa: data.id_empresa,
                id_banco: data.id_banco,
                referencia: data.referencia,
                tipo: data.tipo,
                moneda: data.moneda,
            }));
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    const [formData, setFormData] = useState({
        id_empresa: '',
        id_banco: '',
        referencia: '',
        tipo: '',
        moneda: '',
    });

    const validarFormulario = () => {
        const camposVacios = Object.entries(formData).filter(([key, value]) => !value);
        if (camposVacios.length > 0) {
            const camposFaltantes = camposVacios.map(([key]) => key).join(', ');
            toast.error(`Los siguientes campos son obligatorios: ${camposFaltantes}`);
            return false;
        }
        return true;
    };


    const registrarCuenta = async () => {
        if (!validarFormulario()) return;
        try {
            console.log("Datos válidos:", formData);
            try {
                const response = await odooApi.post("/cuentas/crear_cuenta/", formData);
                if (response.data.mensaje) {
                    toast.success(response.data.mensaje);
                    onClose();
                } else {
                    toast.error(response.data);
                }
            } catch (error) {
                toast.error("Error de conexión: " + error.message);
                console.error(error);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al registrar la cuenta");
        }
    };

    const getEmpresas = async () => {
        try {
            const response = await odooApi.get("/empresas/get_empresas/");
            const data = response.data.map(item => ({
                key: item.id_empresa,
                label: item.empresa,
            }));
            setEmpresas(data)
        } catch (error) {
            toast.error("Error de conexión: " + error.message);
            console.error(error);
        }
    };

    const getBancos = async () => {
        try {
            const response = await odooApi.get("/bancos/get_bancos/");
            const data = response.data.map(item => ({
                key: item.id_banco,
                label: item.banco,
            }));
            setBancos(data)
        } catch (error) {
            toast.error("Error de conexión: " + error.message);
            console.error(error);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    useEffect(() => {
        getEmpresas();
        getBancos();
        if (id_cuenta != 0) {
            getCuentaByID();
        }
    }, []);

    return (
        <>
            <Grid container spacing={2} className="mb-5">

                <Grid item xs={12} md={12}>
                    <Autocomplete
                        variant="bordered"
                        defaultItems={empresas}
                        label="Selecciona una empresa"
                        placeholder="Selecciona una empresa"
                        selectedKey={String(formData.id_empresa || '')}
                        onSelectionChange={(key) => handleChange('id_empresa', key)}
                    >
                        {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
                    </Autocomplete>
                </Grid>

                <Grid item xs={12} md={12}>
                    <Autocomplete
                        variant='bordered'
                        defaultItems={bancos}
                        label="Selecciona un banco"
                        placeholder="Selecciona un banco"
                        selectedKey={String(formData.id_banco || '')}
                        onSelectionChange={(key) => handleChange('id_banco', key)}
                    >
                        {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
                    </Autocomplete>
                </Grid>

                <Grid item xs={12} md={12}>
                    <Select
                        variant="bordered"
                        label="Tipo de moneda"
                        selectedKeys={[formData.moneda]}
                        placeholder="Selecciona un tipo de moneda"
                        onChange={(e) => handleChange('moneda', e.target.value)}
                    >
                        <SelectItem key="MXN">MXN</SelectItem>
                        <SelectItem key="US">US</SelectItem>
                    </Select>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Input
                        label="Referencia de la cuenta"
                        variant="bordered"
                        type="text"
                        value={formData.referencia}
                        onChange={(e) => handleChange('referencia', e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <Select
                        variant="bordered"
                        label="Tipo de cuenta"
                        placeholder="Selecciona un tipo de cuenta"
                        selectedKeys={[formData.tipo]}
                        onChange={(e) => handleChange('tipo', e.target.value)}
                    >
                        <SelectItem key="Cuenta bancaria">Cuenta bancaria</SelectItem>
                        <SelectItem key="Credito revolvente">Credito revolvente</SelectItem>
                        <SelectItem key="Inversiones">Inversiones</SelectItem>
                        <SelectItem key="Tarjeta de credito">Tarjeta de credito</SelectItem>
                        <SelectItem key="Factoraje">Factoraje</SelectItem>
                        <SelectItem key="Cartera">Cartera</SelectItem>
                    </Select>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Stack spacing={2} direction="row">
                        <Button color="primary" onClick={registrarCuenta}>
                            Registrar
                        </Button>
                        <Button color="success" onClick={registrarCuenta} className='text-white'>
                            Actualizar
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
};

export default ListadoCostosExtras;
