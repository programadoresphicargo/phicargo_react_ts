import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";

import { Button } from "@heroui/react";
import axios from "axios";
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { useAuthContext } from "@/modules/auth/hooks";
import { useState } from "react";

const VehiculoForm = ({ onClose }) => {
    const { session } = useAuthContext();
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [placas, setPlacas] = useState("");
    const [tipo_vehiculo, setTipoVehiculo] = useState("");
    const [color, setColor] = useState("");
    const [referencia1, setReferencia1] = useState("");
    const [referencia2, setReferencia2] = useState("");

    const [errors, setErrors] = useState({
        marca: "",
        modelo: "",
        placas: "",
        tipo_vehiculo: "",
        color: ""
    });

    const registrar_vehiculo = async () => {
        setErrors({ marca: "", modelo: "", placas: "", tipo_vehiculo: "", color: "" });

        let hasError = false;
        if (!marca) {
            setErrors(prev => ({ ...prev, marca: "Marca es obligatorio" }));
            hasError = true;
        }
        if (!modelo) {
            setErrors(prev => ({ ...prev, modelo: "Modelo es obligatorio" }));
            hasError = true;
        }
        if (!placas) {
            setErrors(prev => ({ ...prev, placas: "Placas son obligatorias" }));
            hasError = true;
        }
        if (!tipo_vehiculo) {
            setErrors(prev => ({ ...prev, tipo_vehiculo: "Tipo de vehiculo es obligatorio" }));
            hasError = true;
        }
        if (!color) {
            setErrors(prev => ({ ...prev, color: "Color es obligatorio" }));
            hasError = true;
        }

        if (hasError) return;

        const vehiculoData = {
            id_usuario: session.user.id,
            marca,
            modelo,
            placas,
            tipo_vehiculo,
            color,
            referencia1,
            referencia2,
        };

        try {
            const response = await odooApi.post("/vehiculos_visitantes/crear_vehiculo_visitante/", vehiculoData);
            if (response.data.status == 'success') {
                toast.success(response.data.mensaje);
                onClose();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error enviando los datos:" + error);
        }
    };

    return (<>
        <Grid container spacing={2} className="mb-5">
            <Grid item xs={12}>
                <Button color="primary" onClick={registrar_vehiculo}>
                    Registrar vehículo
                </Button>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Marca"
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    error={!!errors.marca}
                    helperText={errors.marca}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Modelo"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    error={!!errors.modelo}
                    helperText={errors.modelo}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Placas"
                    value={placas}
                    onChange={(e) => setPlacas(e.target.value)}
                    error={!!errors.placas}
                    helperText={errors.placas}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined" error={!!errors.tipo_vehiculo}>
                    <InputLabel>Tipo de vehiculo</InputLabel>
                    <Select
                        value={tipo_vehiculo}
                        onChange={(e) => setTipoVehiculo(e.target.value)}
                        label="Tipo de vehiculo"
                    >
                        <MenuItem value="tractocamion">Tractocamión</MenuItem>
                        <MenuItem value="pipa">Pipa</MenuItem>
                        <MenuItem value="automovil">Automóvil</MenuItem>
                        <MenuItem value="motocicleta">Motocicleta</MenuItem>
                        <MenuItem value="camion">Camión</MenuItem>
                        <MenuItem value="grua">Grúa</MenuItem>
                    </Select>
                    {errors.tipo_vehiculo && <span style={{ color: 'red' }}>{errors.tipo_vehiculo}</span>}
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    error={!!errors.color}
                    helperText={errors.color}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Referencia contenedor 1"
                    value={referencia1}
                    onChange={(e) => setReferencia1(e.target.value)}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Referencia contenedor 2"
                    value={referencia2}
                    onChange={(e) => setReferencia2(e.target.value)}
                />
            </Grid>
        </Grid>
    </>
    );
};

export default VehiculoForm;
