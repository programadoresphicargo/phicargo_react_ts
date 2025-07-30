import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Table, TableRow } from "@heroui/react";
import { AccesoContext } from '../context';
import { Button, Input } from '@heroui/react';
import { Grid } from '@mui/material';
import ListadoVisitantes from './tabla';
import { TableBody } from "@heroui/react";
import { TableCell } from "@heroui/react";
import { TableColumn } from "@heroui/react";
import { TableHeader } from "@heroui/react";
import axios from 'axios';

const SelectedVisitantesTable = ({ }) => {

    const [filtroNombre, setFiltroNombre] = useState('');
    const { id_acceso, selectedVisitantes, setSelectedVisitantes, removedVisitors, setRemovedVisitors, disabledFom, formData } = useContext(AccesoContext);

    const [openVisitantes, setVisitants] = useState(false);

    const abrirVisitantes = () => {
        setVisitants(true);
    };

    const cerrarVisitantes = () => {
        setVisitants(false);
    };

    const borrarVisitante = (valueToDelete) => {
        setSelectedVisitantes((prevVisitantes) => {
            const visitanteAEliminar = prevVisitantes.find(visitor => visitor.id_visitante === valueToDelete);

            if (visitanteAEliminar) {
                setRemovedVisitors((prevRemoved) => [...prevRemoved, visitanteAEliminar]);
            }

            return prevVisitantes.filter(visitor => visitor.id_visitante !== valueToDelete);
        });
    };

    const visitantesFiltrados = selectedVisitantes.filter(visitor =>
        visitor.nombre_visitante.toLowerCase().includes(filtroNombre.toLowerCase())
    );

    return (<>

        <Grid item xs={12} sm={12} md={12}>

            <div className="flex flex-wrap gap-4 items-center mb-4">
                <Button onPress={abrirVisitantes} color={disabledFom ? "default" : "primary"} isDisabled={disabledFom || formData.id_empresa == '' ? true : false}>Añadir visitantes al acceso</Button>

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
                    <TableColumn>ID del visitante</TableColumn>
                    <TableColumn>Nombre Visitante</TableColumn>
                    <TableColumn>Acciones</TableColumn>
                </TableHeader>
                <TableBody>
                    {visitantesFiltrados.map((visitor, index) => (
                        <TableRow key={index}>
                            <TableCell>{visitor.id_visitante}</TableCell>
                            <TableCell>{visitor.nombre_visitante.toUpperCase()}</TableCell>
                            <TableCell>
                                <Button
                                    size='sm'
                                    color={disabledFom ? "default" : "primary"}
                                    isDisabled={disabledFom}
                                    onPress={() => borrarVisitante(visitor.id_visitante)}
                                >
                                    Borrar
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Grid>

        <ListadoVisitantes open={openVisitantes} handleClose={cerrarVisitantes}></ListadoVisitantes>

    </>)
}

export default SelectedVisitantesTable;