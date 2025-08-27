import odooApi from "@/api/odoo-api";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    NumberInput,
    Input,
    DatePicker,
    Textarea,
    Progress,
    Chip
} from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Box from '@mui/material/Box';
import { useInventarioTI } from "../../contexto/contexto";
import FormCelulares from "../celulares/form";

export default function StockCelulares({ isOpen, onOpen, onOpenChange }) {
    const { form_data, setFormData } = useInventarioTI();
    const [id_celular, setCelular] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const {
        isOpen: isOpen1,
        onOpen: onOpen1,
        onOpenChange: onOpenChange1,
    } = useDisclosure();
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get('/inventarioti/dispositivos/celular/true');
            const filtrados = response.data.filter(item => item.estado === 'disponible');
            setData(filtrados);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [isOpen, isOpen1]);

    const columns = useMemo(
        () => [
            { accessorKey: 'empresa', header: 'Empresa' },
            { accessorKey: 'imei', header: 'IMEI' },
            { accessorKey: 'marca', header: 'Marca' },
            { accessorKey: 'modelo', header: 'Modelo' },
            { accessorKey: 'correo', header: 'Correo' },
            { accessorKey: 'passwoord', header: 'Contraseña' },
            { accessorKey: 'estado', header: 'Estado' },
            {
                accessorKey: 'editar', header: 'Editar',
                Cell: ({ row }) => (
                    <Button
                        className='text-white'
                        color={'primary'}
                        variant="solid"
                        size='sm'
                        onPress={() => {
                            onOpen1();
                            setCelular(row.original.id_celular);
                        }}
                    >
                        <i class="bi bi-pen"></i>
                        Editar
                    </Button >
                ),
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data,
        enableGrouping: true,
        enableGlobalFilter: true,
        enableFilters: true,
        localization: MRT_Localization_ES,
        state: { showProgressBars: isLoading },
        initialState: {
            showGlobalFilter: true,
            density: 'compact',
            pagination: { pageSize: 80 },
            showColumnFilters: true,
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: ({ event }) => {
                const existe = (form_data.celulares || []).some(
                    cel => cel.id_celular === row.original.id_celular
                );

                if (existe) {
                    toast.error("El celular ya está dentro");
                    return;
                }

                setFormData(prev => ({
                    ...prev,
                    celulares: [...(prev.celulares || []), row.original]
                }));

                onOpenChange();
            },
            style: {
                cursor: 'pointer',
            },
        }),
        muiTableHeadCellProps: {
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'Bold',
                fontSize: '14px',
            },
        },
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '0',
            },
        },
        muiTableBodyCellProps: {
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'normal',
                fontSize: '12px',
            },
        },
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100vh - 300px)',
            },
        },
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <h1
                    className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
                >
                    Celulares disponibles
                </h1>
            </Box>
        ),
    });

    return (
        <>
            <FormCelulares
                isOpen={isOpen1}
                onOpenChange={onOpenChange1}
                id_celular={id_celular}>
            </FormCelulares>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                isDismissable={false}
                isKeyboardDismissDisabled={true}
                size="6xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1"
                                style={{
                                    background: 'linear-gradient(90deg, #a10003, #002887)',
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}>Celulares disponibles</ModalHeader>
                            {isLoading && (
                                <Progress color="primary" isIndeterminate size="sm" />
                            )}
                            <ModalBody>
                                <MaterialReactTable table={table} />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
