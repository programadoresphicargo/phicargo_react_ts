import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Table, TableRow } from "@heroui/react";
import { AccesoContext } from '../context';
import { Button, Input } from '@heroui/react';
import { Grid } from '@mui/material';
import { TableBody } from "@heroui/react";
import { TableCell } from "@heroui/react";
import { TableColumn } from "@heroui/react";
import { TableHeader } from "@heroui/react";
import axios from 'axios';
import ListadoEmpleados from './empleados';

const SelectedEmpleadosTable = ({ }) => {

    const [filtroNombre, setFiltroNombre] = useState('');
    const { id_acceso, selectedEmpleados, setSelectedEmpleados, removedEmpleados, setRemovedEmpleados, disabledFom, formData } = useContext(AccesoContext);

    const [openVisitantes, setVisitants] = useState(false);

    const abrirVisitantes = () => {
        setVisitants(true);
    };

    const cerrarVisitantes = () => {
        setVisitants(false);
    };

    const borrarEmpleado = (valueToDelete) => {
        setSelectedEmpleados((prevVisitantes) => {
            const visitanteAEliminar = prevVisitantes.find(visitor => visitor.id_empleado === valueToDelete);

            if (visitanteAEliminar) {
                setRemovedEmpleados((prevRemoved) => [...prevRemoved, visitanteAEliminar]);
            }

            return prevVisitantes.filter(visitor => visitor.id_empleado !== valueToDelete);
        });
    };

    const empleadosFiltrados = selectedEmpleados.filter(visitor =>
        visitor.empleado.toLowerCase().includes(filtroNombre.toLowerCase())
    );

    return (<>

        <Grid item xs={12} sm={12} md={12}>

            <div className="flex flex-wrap gap-4 items-center mb-4">

                <Button
                    radius='full'
                    onPress={abrirVisitantes}
                    color={disabledFom ? "default" : "secondary"}
                    isDisabled={disabledFom || formData.id_empresa == '' ? true : false}>
                    Añadir empleados
                </Button>

                <Input
                    startContent={<i class="bi bi-search"></i>}
                    color='primary'
                    className="max-w-xs"
                    placeholder="Buscar por nombre"
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                />
            </div>

            <Table aria-label="Example static collection table" isStriped>
                <TableHeader>
                    <TableColumn>ID del empleado</TableColumn>
                    <TableColumn>Empleado</TableColumn>
                    <TableColumn>Acciones</TableColumn>
                </TableHeader>
                <TableBody>
                    {empleadosFiltrados.map((visitor, index) => (
                        <TableRow key={index}>
                            <TableCell>{visitor.id_empleado}</TableCell>
                            <TableCell>{visitor.empleado.toUpperCase()}</TableCell>
                            <TableCell>
                                <Button
                                    size='sm'
                                    color={disabledFom ? "default" : "primary"}
                                    isDisabled={disabledFom}
                                    onPress={() => borrarEmpleado(visitor.id_empleado)}
                                    radius='full'
                                >
                                    Borrar
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Grid>

        <ListadoEmpleados open={openVisitantes} handleClose={cerrarVisitantes}></ListadoEmpleados>

    </>)
}

export default SelectedEmpleadosTable;