import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Button } from "@heroui/button";
import { Table, TableRow } from "@heroui/react";
import { Grid } from '@mui/material';
import { TableHeader } from "@heroui/react";
import { TableCell } from "@heroui/react";
import { TableColumn } from "@heroui/react";
import { TableBody } from "@heroui/react";
import { AccesoContext } from '../context';
import ListadoVisitantes from './tabla';
import axios from 'axios';

const SelectedVisitantesTable = ({ }) => {

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

    return (<>

        <Grid item xs={12} sm={12} md={12}>

            <div className="flex flex-wrap gap-4 items-center">
                <Button onPress={abrirVisitantes} color={disabledFom ? "default" : "primary"} isDisabled={disabledFom || formData.id_empresa == '' ? true : false}>Añadir visitantes al acceso</Button>
            </div>

            <Table aria-label="Example static collection table" isStriped>
                <TableHeader>
                    <TableColumn>ID del visitante</TableColumn>
                    <TableColumn>Nombre Visitante</TableColumn>
                    <TableColumn>Acciones</TableColumn>
                </TableHeader>
                <TableBody>
                    {selectedVisitantes.map((visitor, index) => (
                        <TableRow key={index}>
                            <TableCell>{visitor.id_visitante}</TableCell>
                            <TableCell>{visitor.nombre_visitante}</TableCell>
                            <TableCell>
                                <Button
                                    size='sm'
                                    color={disabledFom ? "default" : "primary"}
                                    isDisabled={disabledFom}
                                    onClick={() => borrarVisitante(visitor.id_visitante)}
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