import {
    Input, Progress, Button, NumberInput
} from "@heroui/react";
import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import odooApi from '@/api/odoo-api';
import toast from 'react-hot-toast';
import { Select, SelectItem } from "@heroui/react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import UnidadesProductos from "./unidades/tabla_unidades_productos";
import FormProducto from "./form_producto";

const IndexProducto = ({ id_producto, open, handleClose, onSaveSuccess }) => {

    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get(`/tms_travel/inventario_equipo/id/${id_producto}`);
            console.log(response.data)
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [open]);

    return (
        <Dialog open={open} onClose={handleClose} fullScreen scroll="body">

            <AppBar elevation={0} sx={{
                background: 'linear-gradient(90deg, #0b2149, #002887)',
                padding: '0 16px',
                position: 'relative'
            }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        {data.x_name}
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleClose}>
                        Salir
                    </Button>
                </Toolbar>
            </AppBar>
            {isLoading && (
                <Progress isIndeterminate aria-label="Loading..." size="sm" />
            )}
            <DialogContent sx={{ width: '100%', padding: 0 }}>
                <Box sx={{ width: '100%' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example"
                                textColor="inherit"
                                sx={{
                                    background: 'linear-gradient(90deg, #0b2149, #002887)',
                                    '& .MuiTabs-indicator': {
                                        backgroundColor: 'white',
                                        height: '2px',
                                    },
                                    padding: '0 16px',
                                }}>
                                <Tab label="Unidades" value="1" sx={{ fontFamily: 'Inter', color: 'white' }} />
                                <Tab label="Datos" value="2" sx={{ fontFamily: 'Inter', color: 'white' }} />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <UnidadesProductos data2={data || []} fetch={fetchData}></UnidadesProductos>
                        </TabPanel>
                        <TabPanel value="2">
                            <FormProducto data={data || []} setData={setData}></FormProducto>
                        </TabPanel>
                    </TabContext>
                </Box>
            </DialogContent>

            <DialogActions>
            </DialogActions>
        </Dialog>
    );
};

export default IndexProducto;
