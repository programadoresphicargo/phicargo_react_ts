import { useEffect, useState } from "react";
import { TextField, MenuItem, Select, InputLabel, FormControl, Grid } from "@mui/material";
import axios from "axios";
import { toast } from 'react-toastify';
import Stack from '@mui/material/Stack';
import odooApi from "../modules/core/api/odoo-api";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
const { VITE_PHIDES_API_URL } = import.meta.env;

const OperadorForm = ({ id_operador, onClose }) => {
    const [nombre_operador, setNombreOperador] = useState("");
    const [password, setPassword] = useState("");

    const actualizarOperador = async () => {
        try {
            const response = await fetch(VITE_PHIDES_API_URL + "/operadores/actualizar.php", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'id_operador': id_operador,
                    'password': password,
                }),
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === "success") {
                toast.success(data.message);
            } else if (data.status === "error") {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Error de conexión: " + error.message);
            console.error(error);
        }
    };

    const getUsuario = async () => {
        try {
            const response = await odooApi.get('/drivers/' + id_operador);
            setNombreOperador(response.data.name);
            setPassword(response.data.password);

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
                        <Button color="primary" onClick={actualizarOperador}>
                            Actualizar
                        </Button>
                    </Stack>
                </Grid>

                <Grid item xs={12} md={12}>
                    <Input
                        variant="outlined"
                        label="Usuario"
                        value={id_operador}
                        disabled
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <Input
                        variant="outlined"
                        label="Nombre"
                        value={nombre_operador}
                        disabled
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <Input
                        fullWidth
                        variant="outlined"
                        label="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default OperadorForm;
