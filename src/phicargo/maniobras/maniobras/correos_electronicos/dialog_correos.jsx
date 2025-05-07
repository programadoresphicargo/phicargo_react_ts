import { Autocomplete, AutocompleteItem } from "@heroui/react";
import {
    Button,
    Select,
    SelectItem,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@heroui/react";
import React, { useContext, useEffect, useState } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormularioCorreo from './formulario';
import { ManiobraContext } from '../../context/viajeContext';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';

const CorreosLigadosManiobra = ({ open, handleClose }) => {
    const { id_maniobra, id_cliente, formData, setFormData, formDisabled, setFormDisabled } = useContext(ManiobraContext);
    const [correosCliente, setCorreosCliente] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openF, setOpenF] = useState(false);

    const cerrar = () => {
        setOpenF(false);
        fetchCorreos();
    }

    useEffect(() => {
        if (open) {
            fetchCorreos();
        }
    }, [open]);

    const fetchCorreos = async () => {
        try {
            setIsLoading(true);
            const response = await odooApi.get(`/correos/get_by_id_cliente/${id_cliente}`);
            setCorreosCliente(response.data);
        } catch (error) {
            console.error('Error al obtener los correos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = (correoId) => {
        const correoIdNum = Number(correoId.target ? correoId.target.value : correoId);
        const correoSeleccionado = correosCliente.find(c => c.id_correo === correoIdNum);

        if (!correoSeleccionado) {
            toast.warn(`⚠️ Correo con ID ${correoIdNum} no encontrado.`);
            return;
        }

        if (formData.correos_ligados.some(c => c.id_correo === correoIdNum)) {
            toast.warn(`⏳ Correo con ID ${correoIdNum} ya está en la lista.`);
            return;
        }

        setFormData(prevFormData => ({
            ...prevFormData,
            correos_ligados: [...prevFormData.correos_ligados, correoSeleccionado],
        }));
    };

    const handleRemove = (correoId) => {
        const correoIdNum = Number(correoId);
        const correoEliminado = formData.correos_ligados.find(c => c.id_correo === correoIdNum);

        if (!correoEliminado) {
            toast.warn(`⚠️ Correo con ID ${correoIdNum} no encontrado.`);
            return;
        }

        setFormData(prevFormData => ({
            ...prevFormData,
            correos_ligados: prevFormData.correos_ligados.filter(c => c.id_correo !== correoIdNum),
            correos_desligados: [...prevFormData.correos_desligados, correoEliminado],
        }));

        toast.success(`❌ Eliminado correo con ID: ${correoIdNum}`);
    };

    return (
        <>
            <FormularioCorreo open={openF} handleClose={cerrar} />

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Correos Ligados a Maniobra M-{id_maniobra}</DialogTitle>
                <DialogContent>
                    <div className='mb-3'>
                        <Button color='primary' onPress={() => setOpenF(true)}>Nuevo correo</Button>
                    </div>

                    <Autocomplete
                        className="mb-3"
                        label="Correos electrónicos"
                        placeholder="Selecciona los correos"
                        variant="bordered"
                        isDisabled={formDisabled}
                        onSelectionChange={handleAdd}
                    >
                        {correosCliente.map((correo) => (
                            <AutocompleteItem key={correo.id_correo} value={correo.id_correo}>
                                {correo.correo}
                            </AutocompleteItem>
                        ))}
                    </Autocomplete>

                    {isLoading ? (
                        <Spinner label="Cargando correos..." />
                    ) : (
                        <Table aria-label="Correos ligados a maniobra" isStriped isCompact>
                            <TableHeader>
                                <TableColumn>ID</TableColumn>
                                <TableColumn>Nombre</TableColumn>
                                <TableColumn>Correo</TableColumn>
                                <TableColumn>Tipo</TableColumn>
                                <TableColumn>Acciones</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {formData.correos_ligados.length > 0 ? (
                                    formData.correos_ligados.map((item) => (
                                        <TableRow key={item.id_correo}>
                                            <TableCell>{item.id_correo}</TableCell>
                                            <TableCell>{item.nombre_completo}</TableCell>
                                            <TableCell>{item.correo}</TableCell>
                                            <TableCell>{item.tipo}</TableCell>
                                            <TableCell>
                                                <Button color="danger" onPress={() => handleRemove(item.id_correo)} size='sm' isDisabled={formDisabled}>
                                                    Eliminar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell>
                                            No hay correos registrados.
                                        </TableCell>
                                        <TableCell>
                                        </TableCell>
                                        <TableCell>
                                        </TableCell>
                                        <TableCell>
                                        </TableCell>
                                        <TableCell>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}

                </DialogContent>
                <DialogActions>
                    <Button onPress={handleClose} color="primary">Cerrar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CorreosLigadosManiobra;
