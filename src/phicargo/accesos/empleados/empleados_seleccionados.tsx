import { useState } from 'react';
import { Table, TableRow } from "@heroui/react";
import { useAcceso } from '../context';
import { Button, Input } from '@heroui/react';
import { Grid } from '@mui/material';
import { TableBody } from "@heroui/react";
import { TableCell } from "@heroui/react";
import { TableColumn } from "@heroui/react";
import { TableHeader } from "@heroui/react";
import ListadoEmpleados from './empleados';

const SelectedEmpleadosTable = ({ }) => {

    const [filtroNombre, setFiltroNombre] = useState('');
    const { empleadosActuales, disabledForm, EliminarEmpleadoAcceso } = useAcceso();

    const [openVisitantes, setVisitants] = useState(false);

    const abrirVisitantes = () => {
        setVisitants(true);
    };

    const cerrarVisitantes = () => {
        setVisitants(false);
    };

    const empleadosFiltrados = empleadosActuales.filter(visitor =>
        visitor.empleado.toLowerCase().includes(filtroNombre.toLowerCase())
    );

    return (<>

        <Grid item xs={12} sm={12} md={12}>

            <div className="flex flex-wrap gap-4 items-center mb-4">

                <Button
                    radius='full'
                    onPress={abrirVisitantes}
                    color={disabledForm ? "default" : "secondary"}
                    isDisabled={disabledForm}
                >
                    Añadir empleados
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
                    <TableColumn>ID del empleado</TableColumn>
                    <TableColumn>Empleado</TableColumn>
                    <TableColumn>Jefe</TableColumn>
                    <TableColumn>Acciones</TableColumn>
                </TableHeader>
                <TableBody>
                    {empleadosFiltrados.map((visitor, index) => (
                        <TableRow key={index}>
                            <TableCell>{visitor?.id_empleado}</TableCell>
                            <TableCell>{visitor?.empleado?.toUpperCase()}</TableCell>
                            <TableCell>{visitor?.jefe?.toUpperCase()}</TableCell>
                            <TableCell>
                                <Button
                                    size='sm'
                                    color={disabledForm ? "default" : "primary"}
                                    isDisabled={disabledForm}
                                    onPress={() => EliminarEmpleadoAcceso(visitor.id_empleado)}
                                    radius='full'
                                >
                                    Borrar
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Grid >

        <ListadoEmpleados open={openVisitantes} handleClose={cerrarVisitantes}></ListadoEmpleados>

    </>)
}

export default SelectedEmpleadosTable;