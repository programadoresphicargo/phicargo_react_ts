import React, { useState, useEffect, useContext } from 'react';
import { Button, CardHeader } from "@heroui/react";
import Autocomplete from '@mui/material/Autocomplete';
import { Card, CardBody } from "@heroui/react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import AccesoCompo from '../AccesoCompo';
import { AccesoContext } from '../context';
import RegistroVehiculos from './registros_vehiculos';
import Slide from '@mui/material/Slide';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const ModuloVehiculo = ({ disabled }) => {
    const { selectVehiculos, EliminarVehiculo } = useContext(AccesoContext);

    const [openFormVehiculo, setOpenFormVehiculo] = React.useState(false);

    const handleClickOpenFormVehiculo = () => {
        setOpenFormVehiculo(true);
    };

    const handleCloseFormVehiculo = () => {
        setOpenFormVehiculo(false);
    };

    return (<>
        <Card>
            <CardHeader
                style={{
                    background: 'linear-gradient(90deg, #0b2149, #002887)',
                    color: 'white',
                    fontWeight: 'bold',
                }}
            >
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <h1>Vehículos visitantes</h1>
                    </Grid>
                    <Grid item>
                        <Button
                            color="primary"
                            onPress={handleClickOpenFormVehiculo}
                            isDisabled={disabled}
                        >
                            Añadir vehículo
                        </Button>
                    </Grid>
                </Grid>
            </CardHeader>
            <CardBody>

                <Grid item xs={12} sm={12} md={12} className='mt-2'>
                    <Table aria-label="Example static collection table" isStriped>
                        <TableHeader>
                            <TableColumn>ID del vehiculo</TableColumn>
                            <TableColumn>Marca</TableColumn>
                            <TableColumn>Modelo</TableColumn>
                            <TableColumn>Placas</TableColumn>
                            <TableColumn>Color</TableColumn>
                            <TableColumn>Contenedor 1</TableColumn>
                            <TableColumn>Contenedor 2</TableColumn>
                            <TableColumn>Descartar</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {selectVehiculos.map((visitor, index) => (
                                <TableRow key={index}>
                                    <TableCell>{visitor.id_vehiculo}</TableCell>
                                    <TableCell>{visitor.marca}</TableCell>
                                    <TableCell>{visitor.modelo}</TableCell>
                                    <TableCell>{visitor.placas}</TableCell>
                                    <TableCell>{visitor.color}</TableCell>
                                    <TableCell>{visitor.contenedor1}</TableCell>
                                    <TableCell>{visitor.contenedor2}</TableCell>
                                    <TableCell>
                                        <Button onPress={() => EliminarVehiculo(visitor.id_vehiculo)} size='sm' isDisabled={disabled}>Eliminar</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>

            </CardBody>
        </Card>

        <Dialog
            fullWidth={false}
            maxWidth={false}
            open={openFormVehiculo}
            TransitionComponent={Transition}
            onClose={handleCloseFormVehiculo}
            scroll='paper'
        >
            <DialogContent>
                <RegistroVehiculos onClose={handleCloseFormVehiculo}></RegistroVehiculos>
            </DialogContent>
        </Dialog>
    </>
    );
};

export default ModuloVehiculo;
