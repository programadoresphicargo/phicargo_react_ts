import React, { useContext } from 'react';
import { Button, CardHeader } from "@heroui/react";
import { Card, CardBody } from "@heroui/react";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { AccesoContext } from '../context';
import RegistroVehiculos from './tabla';

type Props = {
    isDisabled: boolean,
};

const ModuloVehiculo: React.FC<Props> = ({
    isDisabled
}) => {

    const { selectVehiculos, EliminarVehiculo } = useContext(AccesoContext);

    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (<>
        <Card>
            <CardHeader
                style={{
                    background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
                    color: 'white',
                    fontWeight: 'bold'
                }}
            >
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        Vehículos visitantes
                    </Grid>
                    <Grid item>
                        <Button
                            color="primary"
                            onPress={handleClick}
                            isDisabled={isDisabled}
                            radius='full'
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
                            <TableColumn>ID</TableColumn>
                            <TableColumn>Marca</TableColumn>
                            <TableColumn>Modelo</TableColumn>
                            <TableColumn>Placas</TableColumn>
                            <TableColumn>Color</TableColumn>
                            <TableColumn>Contenedor 1</TableColumn>
                            <TableColumn>Contenedor 2</TableColumn>
                            <TableColumn>Descartar</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {selectVehiculos.map((visitor: any, index: any) => (
                                <TableRow key={index}>
                                    <TableCell>{visitor.id_vehiculo}</TableCell>
                                    <TableCell>{visitor.marca}</TableCell>
                                    <TableCell>{visitor.modelo}</TableCell>
                                    <TableCell>{visitor.placas}</TableCell>
                                    <TableCell>{visitor.color}</TableCell>
                                    <TableCell>{visitor.contenedor1}</TableCell>
                                    <TableCell>{visitor.contenedor2}</TableCell>
                                    <TableCell>
                                        <Button onPress={() => EliminarVehiculo(visitor.id_vehiculo)} size='sm' isDisabled={isDisabled} radius='full'>Eliminar</Button>
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
            open={open}
            onClose={handleClose}
            scroll='paper'
        >
            <DialogContent>
                <RegistroVehiculos onClose={handleClose}></RegistroVehiculos>
            </DialogContent>
        </Dialog>
    </>
    );
};

export default ModuloVehiculo;
