import { FormControl, Grid, InputLabel, MenuItem, TextField } from "@mui/material";

import { Button, Checkbox, Divider, Input, Progress } from "@heroui/react";
import axios from "axios";
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { useAuthContext } from "@/modules/auth/hooks";
import { useEffect, useState } from "react";
import { Select, SelectItem } from "@heroui/react";

const VehiculoForm = ({ open, onClose, id_vehiculo }) => {
    const { session } = useAuthContext();

    const [dataVehicle, setDataVehicle] = useState({});
    const [isLoading, setLoading] = useState(false);

    const fetchDataVehiculo = async (id_vehiculo) => {
        try {
            const response = await odooApi.get('/vehiculos_visitantes/' + id_vehiculo);
            setDataVehicle(response.data);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    useEffect(() => {
        fetchDataVehiculo(id_vehiculo);
    }, [open, id_vehiculo]);

    const updateDataVehicle = (field, value) => {
        setDataVehicle(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const [errors, setErrors] = useState({
        marca: "",
        modelo: "",
        placas: "",
        tipo_vehiculo: "",
        color: ""
    });

    const registrar_vehiculo = async () => {
        console.log(dataVehicle);
        setErrors({ marca: "", modelo: "", placas: "", tipo_vehiculo: "", color: "" });

        let hasError = false;
        if (!dataVehicle?.marca) {
            setErrors(prev => ({ ...prev, marca: "Marca es obligatorio" }));
            hasError = true;
        }
        if (!dataVehicle?.modelo) {
            setErrors(prev => ({ ...prev, modelo: "Modelo es obligatorio" }));
            hasError = true;
        }
        if (!dataVehicle?.placas) {
            setErrors(prev => ({ ...prev, placas: "Placas son obligatorias" }));
            hasError = true;
        }
        if (!dataVehicle?.tipo_vehiculo) {
            setErrors(prev => ({ ...prev, tipo_vehiculo: "Tipo de vehiculo es obligatorio" }));
            hasError = true;
        }
        if (!dataVehicle?.color) {
            setErrors(prev => ({ ...prev, color: "Color es obligatorio" }));
            hasError = true;
        }

        if (hasError) return;

        try {
            setLoading(true);
            let response; // <-- usar let porque se asigna después

            if (id_vehiculo) {
                response = await odooApi.patch("/vehiculos_visitantes/", dataVehicle);
            } else {
                response = await odooApi.post("/vehiculos_visitantes/", dataVehicle);
            }

            if (response.data.status === 'success') {
                toast.success(response.data.mensaje);
                onClose();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error enviando los datos: " + error);
        } finally {
            setLoading(false); // <-- mejor usar finally para asegurar que siempre se ejecute
        }

    };

    const actualizar_vehiculo = async () => {
        console.log(dataVehicle);
    };

    return (<>
        <Grid container spacing={2} className="mb-5">
            <Grid item xs={12}>
                <Button color="primary" onPress={registrar_vehiculo} isLoading={isLoading} radius="full">
                    {id_vehiculo ? "Actualizar" : "Registrar"}
                </Button>
            </Grid>

            {isLoading && (
                <Progress isIndeterminate aria-label="Loading..." size="sm" />
            )}

            <Grid item xs={12} md={6}>
                <Input
                    fullWidth
                    variant="bordered"
                    label="Marca"
                    value={dataVehicle?.marca}
                    onChange={(e) => updateDataVehicle("marca", e.target.value)}
                    isInvalid={!!errors.marca}
                    errorMessage={errors.marca}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Input
                    fullWidth
                    variant="bordered"
                    label="Modelo"
                    value={dataVehicle?.modelo}
                    onChange={(e) => updateDataVehicle("modelo", e.target.value)}
                    isInvalid={!!errors.modelo}
                    errorMessage={errors.modelo}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Input
                    fullWidth
                    variant="bordered"
                    label="Placas"
                    value={dataVehicle?.placas}
                    onChange={(e) => updateDataVehicle("placas", e.target.value)}
                    isInvalid={!!errors.placas}
                    errorMessage={errors.placas}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Select
                    variant="bordered"
                    selectedKeys={[dataVehicle?.tipo_vehiculo]}
                    onChange={(e) => updateDataVehicle("tipo_vehiculo", e.target.value)}
                    label="Tipo de vehiculo"
                    isInvalid={!!errors.tipo_vehiculo}
                    errorMessage={errors.tipo_vehiculo}
                >
                    <SelectItem key="tractocamion">Tractocamión</SelectItem>
                    <SelectItem key="pipa">Pipa</SelectItem>
                    <SelectItem key="automovil">Automóvil</SelectItem>
                    <SelectItem key="motocicleta">Motocicleta</SelectItem>
                    <SelectItem key="camion">Camión</SelectItem>
                    <SelectItem key="grua">Grúa</SelectItem>
                </Select>
            </Grid>
            <Grid item xs={12} md={6}>
                <Input
                    fullWidth
                    variant="bordered"
                    label="Color"
                    value={dataVehicle?.color}
                    onChange={(e) => updateDataVehicle("color", e.target.value)}
                    isInvalid={!!errors.color}
                    errorMessage={errors.color}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Input
                    fullWidth
                    variant="bordered"
                    label="Referencia contenedor 1"
                    value={dataVehicle?.contenedor1}
                    onChange={(e) => updateDataVehicle("contenedor1", e.target.value)}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Input
                    fullWidth
                    variant="bordered"
                    label="Referencia contenedor 2"
                    value={dataVehicle?.contenedor2}
                    onChange={(e) => updateDataVehicle("contenedor2", e.target.value)}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Checkbox onValueChange={(e) => updateDataVehicle("utilitario", e)} isSelected={dataVehicle?.utilitario}>Vehículo utilitario</Checkbox>
            </Grid>
        </Grid>
    </>
    );
};

export default VehiculoForm;
