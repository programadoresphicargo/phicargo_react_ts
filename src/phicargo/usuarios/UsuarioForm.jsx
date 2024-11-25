import { useEffect, useState } from "react";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Grid } from "@mui/material";
import axios from "axios";
import { toast } from 'react-toastify';
import Stack from '@mui/material/Stack';

const UsuarioForm = ({ id_usuario, onClose }) => {
    const [usuario, setUsuario] = useState("");
    const [nombre, setNombre] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [tipoUsuario, setTipoUsuario] = useState("");
    const [estado, setEstado] = useState("");
    const [correo, setCorreo] = useState("");
    const [pin, setPin] = useState("");

    const [errors, setErrors] = useState({
        usuario: "",
        nombre: "",
        contrasena: "",
        tipoUsuario: "",
        estado: "",
        correo: "",
        pin: ""
    });

    const registrarUsuario = async () => {
        setErrors({
            usuario: "", nombre: "", contrasena: "", tipoUsuario: "",
            estado: "", correo: "", pin: ""
        });

        let hasError = false;

        // Validaciones
        if (!usuario) {
            setErrors(prev => ({ ...prev, usuario: "Usuario es obligatorio" }));
            hasError = true;
        }
        if (!nombre) {
            setErrors(prev => ({ ...prev, nombre: "Nombre es obligatorio" }));
            hasError = true;
        }
        if (!contrasena) {
            setErrors(prev => ({ ...prev, contrasena: "Contraseña es obligatoria" }));
            hasError = true;
        }
        if (!tipoUsuario) {
            setErrors(prev => ({ ...prev, tipoUsuario: "Tipo de usuario es obligatorio" }));
            hasError = true;
        }
        if (!estado) {
            setErrors(prev => ({ ...prev, estado: "Estado es obligatorio" }));
            hasError = true;
        }
        if (!correo) {
            setErrors(prev => ({ ...prev, correo: "Correo es obligatorio" }));
            hasError = true;
        }
        if (!pin || isNaN(pin)) {
            setErrors(prev => ({ ...prev, pin: "Pin debe ser un número" }));
            hasError = true;
        }

        if (hasError) return;

        const usuarioData = {
            usuario,
            nombre,
            contrasena,
            tipoUsuario,
            estado,
            correo,
            pin
        };

        try {
            const response = await axios.post("/phicargo/accesos/usuarios/registrar_usuario.php", usuarioData);
            if (response.data.mensaje) {
                toast.success(response.data.mensaje);
                onClose();
            } else {
                toast.error(response.data.error);
            }
        } catch (error) {
            toast.error("Error enviando los datos: " + error);
        }
    };

    const getUsuario = async () => {

        const usuarioData = {
            id_usuario
        };

        try {
            const response = await axios.post("/phicargo/usuarios/usuarios/getUsuario.php", usuarioData);
            var data = response.data[0];
            setUsuario(data.usuario)
            setNombre(data.nombre)
            setContrasena(data.passwoord)
            setCorreo(data.correo)
            setTipoUsuario(data.tipo)
            setEstado(data.estado)
            setPin(data.pin)
        } catch (error) {
            toast.error("Error enviando los datos: " + error);
        }
    };

    useEffect(() => {
        getUsuario();
    }, []);

    return (
        <>
            <Grid container spacing={2} className="mb-5">
                <Grid item xs={12} md={12}>
                    <Stack spacing={2} direction="row">
                        <Button variant="contained" color="primary" onClick={registrarUsuario}>
                            Registrar
                        </Button>
                        <Button variant="contained" color="primary" onClick={registrarUsuario}>
                            Actualizar
                        </Button>
                    </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        error={!!errors.usuario}
                        helperText={errors.usuario}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        error={!!errors.nombre}
                        helperText={errors.nombre}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        type="password"
                        label="Contraseña"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        error={!!errors.contrasena}
                        helperText={errors.contrasena}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined" error={!!errors.tipoUsuario}>
                        <InputLabel>Tipo de Usuario</InputLabel>
                        <Select
                            value={tipoUsuario}
                            onChange={(e) => setTipoUsuario(e.target.value)}
                            label="Tipo de Usuario"
                        >
                            <MenuItem value="Administrador">Administrador</MenuItem>
                            <MenuItem value="Ejecutivo">Ejecutivo</MenuItem>
                            <MenuItem value="Contabilidad">Contabilidad</MenuItem>
                        </Select>
                        {errors.tipoUsuario && <span style={{ color: 'red' }}>{errors.tipoUsuario}</span>}
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined" error={!!errors.estado}>
                        <InputLabel>Estado</InputLabel>
                        <Select
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            label="Estado"
                        >
                            <MenuItem value="Activo">Activo</MenuItem>
                            <MenuItem value="Inactivo">Inactivo</MenuItem>
                        </Select>
                        {errors.estado && <span style={{ color: 'red' }}>{errors.estado}</span>}
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Correo"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        error={!!errors.correo}
                        helperText={errors.correo}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Pin"
                        type="number"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        error={!!errors.pin}
                        helperText={errors.pin}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default UsuarioForm;
