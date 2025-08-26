import { Autocomplete, AutocompleteItem, Button, Chip } from '@heroui/react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { DatePicker } from 'antd';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import odooApi from '@/api/odoo-api';
import NavbarInventarioTI from '../../navbar';
import FormCelulares from './form';
import {
    useDisclosure,
} from "@heroui/react";

const SelectEmpleadosTI = ({ handleChange, value }) => {
    const [empleados, setEmpleados] = useState([]);
    const [isLoadingEmpleados, setLoadingEmpleados] = useState(false);

    const fetchData = async () => {
        try {
            setLoadingEmpleados(true);
            const response = await odooApi.get("/inventarioti/empleados/");
            setEmpleados(response.data);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoadingEmpleados(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Autocomplete
            label="Empleado ligado a baja"
            selectedKey={value ? String(value) : undefined}
            isLoading={isLoadingEmpleados}
            onSelectionChange={(key) => handleChange("empleado_baja", Number(key))}
            isInvalid={!value}
            errorMessage={!value ? "El empleado es obligatorio" : ""}
        >
            {empleados.map((empleado) => (
                <AutocompleteItem key={String(empleado.id_empleado)}>
                    {empleado.nombre_empleado + ' - ' + empleado.puesto}
                </AutocompleteItem>
            ))}
        </Autocomplete>
    );
};

export default SelectEmpleadosTI;

