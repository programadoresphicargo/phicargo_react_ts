import { Autocomplete, AutocompleteItem } from "@heroui/react";
import {
    Button,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@heroui/react";
import { useContext, useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { ManiobraContext } from '../../context/viajeContext';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import FormularioCorreoGeneral from "@/phicargo/correos_electronicos/form";
import { CorreoCliente } from "@/phicargo/viajes/correos/correos_electronicos";
import { Key } from 'react';

const CorreosLigadosManiobra = ({ open, handleClose, id_cliente }: { open: boolean, handleClose: () => void, id_cliente: number }) => {

    const {
        formDisabled,
        correos_ligados,
        setCorreosLigados,
        setCorreosDesligados
    } = useContext(ManiobraContext);

    const [correosCliente, setCorreosCliente] = useState<CorreoCliente[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openF, setOpenF] = useState(false);

    const cerrar = () => {
        setOpenF(false);
        fetchCorreos();
    };

    useEffect(() => {
        if (open) fetchCorreos();
    }, [open]);

    const fetchCorreos = async () => {
        try {
            setIsLoading(true);
            const response = await odooApi.get<CorreoCliente[]>(`/correos/id_cliente/${id_cliente}`);
            setCorreosCliente(response.data);
        } catch (error) {
            console.error('Error al obtener los correos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = (correoId: Key | null) => {
        if (correoId === null) return;

        const correoIdNum = Number(correoId);
        const correoSeleccionado = correosCliente.find(c => c.id_correo === correoIdNum);

        if (!correoSeleccionado) {
            toast.warn(`⚠️ Correo con ID ${correoIdNum} no encontrado.`);
            return;
        }

        if (correos_ligados.some(c => c.id_correo === correoIdNum)) {
            toast.warn(`⏳ Correo con ID ${correoIdNum} ya está en la lista.`);
            return;
        }

        setCorreosLigados(prev => [...prev, correoSeleccionado]);
    };

    const handleRemove = (correoId: number) => {
        const correoIdNum = Number(correoId);
        const correoEliminado = correos_ligados.find(c => c.id_correo === correoIdNum);

        if (!correoEliminado) {
            toast.warn(`⚠️ Correo con ID ${correoIdNum} no encontrado.`);
            return;
        }

        setCorreosLigados(prev => prev.filter(c => c.id_correo !== correoIdNum));
        setCorreosDesligados(prev => [...prev, correoEliminado]);

        toast.success(`❌ Eliminado correo con ID: ${correoIdNum}`);
    };

    return (
        <>
            <FormularioCorreoGeneral open={openF} handleClose={cerrar} id_cliente={id_cliente}></FormularioCorreoGeneral>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '25px',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.0)',
                    },
                }}
                BackdropProps={{
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    },
                }}
            >
                <DialogTitle>Correos Ligados a Maniobra</DialogTitle>

                <DialogContent>
                    <div className='mb-3'>
                        <Button color='primary' onPress={() => setOpenF(true)} radius="full">
                            Nuevo correo
                        </Button>
                    </div>

                    <Autocomplete
                        className="mb-3"
                        label="Correos electrónicos"
                        placeholder="Selecciona los correos"
                        variant="bordered"
                        isDisabled={formDisabled}
                        onSelectionChange={handleAdd}
                        isLoading={isLoading}
                    >
                        {correosCliente.map((correo) => (
                            <AutocompleteItem key={correo.id_correo}>
                                {correo.correo}
                            </AutocompleteItem>
                        ))}
                    </Autocomplete>

                    {isLoading ? (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '300px'
                        }}>
                            <Spinner label="Cargando correos..." />
                        </div>
                    ) : (
                        <Table aria-label="Correos ligados a maniobra" isStriped isCompact>
                            <TableHeader>
                                <TableColumn>ID</TableColumn>
                                <TableColumn>Nombre</TableColumn>
                                <TableColumn>Correo</TableColumn>
                                <TableColumn>Tipo</TableColumn>
                                <TableColumn>Acciones</TableColumn>
                            </TableHeader>

                            <TableBody
                                emptyContent="No hay correos registrados."
                            >
                                {correos_ligados.map((item) => (
                                    <TableRow key={item.id_correo}>
                                        <TableCell>{item.id_correo}</TableCell>
                                        <TableCell>{item.nombre_completo}</TableCell>
                                        <TableCell>{item.correo}</TableCell>
                                        <TableCell>{item.tipo}</TableCell>
                                        <TableCell>
                                            <Button
                                                color="danger"
                                                onPress={() => handleRemove(item.id_correo)}
                                                size="sm"
                                                isDisabled={formDisabled}
                                                radius="full"
                                            >
                                                Eliminar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onPress={handleClose} color="default" radius="full">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CorreosLigadosManiobra;
