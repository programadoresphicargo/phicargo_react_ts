import { useState } from 'react';
import { Table, TableRow } from "@heroui/react";
import { useAcceso } from '../context/context';
import { Button, Input } from '@heroui/react';
import { Grid } from '@mui/material';
import ListadoVisitantes from './tabla';
import { TableBody } from "@heroui/react";
import { TableCell } from "@heroui/react";
import { TableColumn } from "@heroui/react";
import { TableHeader } from "@heroui/react";

interface Props {
    id_empresa: number | null,
}

const SelectedVisitantesTable = ({ id_empresa }: Props) => {

    const [filtroNombre, setFiltroNombre] = useState('');
    const { EliminarVisitanteAcceso, disabledForm, visitantesActuales } = useAcceso();

    const [openVisitantes, setVisitants] = useState(false);

    const abrirVisitantes = () => {
        setVisitants(true);
    };

    const cerrarVisitantes = () => {
        setVisitants(false);
    };

    const visitantesFiltrados = visitantesActuales.filter(visitor =>
        visitor.nombre_visitante.toLowerCase().includes(filtroNombre.toLowerCase())
    );

    return (<>

        <Grid item xs={12} sm={12} md={12}>

            <div className="flex flex-wrap gap-4 items-center mb-4">
                <Button
                    radius='full'
                    onPress={abrirVisitantes}
                    color={disabledForm ? "default" : "primary"}
                    isDisabled={disabledForm}>
                    Añadir visitantes
                </Button>

                <Input
                    startContent={<i className="bi bi-search"></i>}
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
                                    color={disabledForm ? "default" : "primary"}
                                    isDisabled={disabledForm}
                                    onPress={() => EliminarVisitanteAcceso(visitor.id_visitante)}
                                    radius='full'
                                >
                                    <i className="bi bi-x-circle"></i>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Grid>

        {id_empresa != null && (
            <ListadoVisitantes
                open={openVisitantes}
                handleClose={cerrarVisitantes}
                id_empresa={id_empresa}
            />
        )}
    </>)
}

export default SelectedVisitantesTable;