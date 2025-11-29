import { Autocomplete, AutocompleteItem, DatePicker, Progress, Select, SelectItem } from "@heroui/react";
import { FormControl, Grid, Grid2, InputLabel, MenuItem, TextField } from "@mui/material";
import React, { useEffect, useMemo, useState } from 'react';
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import { Button } from "@heroui/react";
import { Input } from "@heroui/react";
import Stack from '@mui/material/Stack';
import axios from "axios";
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';

const CuentaForm = ({ id_cuenta, onClose }) => {
    const fechaActual = new Date().toISOString().split('T')[0];
    const [value, setValue] = React.useState(parseDate(fechaActual));
    const [empresas, setEmpresas] = React.useState([]);
    const [bancos, setBancos] = React.useState([]);
    const [isLoading, setLoading] = React.useState(false);

    const getCuenta = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/cuentas/' + id_cuenta);
            setFormData(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error al obtener los datos:', error);
        }
    };

    const [formData, setFormData] = useState({});

    const validarFormulario = () => {
        const camposVacios = Object.entries(formData).filter(([key, value]) => !value);
        if (camposVacios.length > 0) {
            const camposFaltantes = camposVacios.map(([key]) => key).join(', ');
            toast.error(`Los siguientes campos son obligatorios: ${camposFaltantes}`);
            return false;
        }
        return true;
    };


    const registrar = async () => {
        if (!validarFormulario()) return;
        try {
            setLoading(true);
            const response = await odooApi.post("/cuentas/", formData);
            if (response.data.status == "success") {
                toast.success(response.data.message);
                onClose();
            } else {
                toast.error(response.data);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error("Error de conexión: " + error.message);
        }
    };

    const actualizar = async () => {
        if (!validarFormulario()) return;
        try {
            setLoading(true);
            const response = await odooApi.patch("/cuentas/" + id_cuenta, formData);
            if (response.data.status == "success") {
                toast.success(response.data.menssage);
                onClose();
            } else {
                toast.error(response.data);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error("Error de conexión: " + error.message);
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
        if (id_cuenta) {
            getCuenta();
        }
    }, []);

    return (
        <>
            {isLoading && (
                <Progress isIndeterminate size="sm" className="mb-5"></Progress>
            )}

            {id_cuenta && (<h1 className="mb-5">Cuenta No. {id_cuenta}</h1>)}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                <Stack direction="row">
                    {!id_cuenta && (
                        <Button color="primary" onPress={registrar} radius="full" isLoading={isLoading}>
                            Registrar
                        </Button>
                    )}
                    {id_cuenta && (
                        <Button color="success" onPress={actualizar} className='text-white' radius="full" isLoading={isLoading}>
                            Actualizar
                        </Button>
                    )}
                </Stack>

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

                <Input
                    label="Referencia de la cuenta"
                    variant="bordered"
                    type="text"
                    value={formData.referencia}
                    onChange={(e) => handleChange('referencia', e.target.value)}
                />

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

            </div>
        </>
    );
};

export default CuentaForm;
