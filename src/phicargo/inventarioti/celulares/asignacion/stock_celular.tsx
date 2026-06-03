import odooApi from "@/api/odoo-api";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@heroui/react";
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
    MRT_Cell,
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Box from '@mui/material/Box';
import FormCelulares from "../celulares/form";
import { FieldArrayWithId, UseFieldArrayAppend } from "react-hook-form";
import { AsignacionActivo } from "./form";
import { Celular } from "../celulares/schema";

interface CelularesProps {
    isOpen: boolean;
    onOpenChange: () => void;
    celularesFields: FieldArrayWithId<AsignacionActivo, "celulares", "id">[];
    appendCelular: UseFieldArrayAppend<AsignacionActivo, "celulares">;
}

export default function StockCelulares({ isOpen, onOpenChange, celularesFields, appendCelular }: CelularesProps) {

    const [id_celular, setCelular] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const {
        isOpen: isOpen1,
        onOpen: onOpen1,
        onOpenChange: onOpenChange1,
    } = useDisclosure();

    const [data, setData] = useState<Celular[]>([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get<Celular[]>('/inventarioti/dispositivos/celular/true');
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
            {
                accessorKey: 'id_celular',
                header: 'Editar',
                Cell: ({ cell }: { cell: MRT_Cell<Celular> }) => (
                    <Button
                        className='text-white'
                        color={'primary'}
                        variant="solid"
                        size='sm'
                        radius="full"
                        onPress={() => {
                            onOpen1();
                            setCelular(cell.getValue<number>());
                        }}
                    >
                        <i className="bi bi-pen"></i>
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
            pagination: { pageIndex: 0, pageSize: 80 },
            showColumnFilters: true,
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => {
                const existe = (celularesFields || []).some(
                    cel => cel.id_celular === row.original.id_celular
                );

                if (existe) {
                    toast.error("El celular ya está dentro");
                    return;
                }

                appendCelular(row.original);
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
        renderTopToolbarCustomActions: () => (
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
                id_celular={id_celular}
            />

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                isDismissable={false}
                isKeyboardDismissDisabled={true}
                size="full">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1"
                                style={{
                                    background: 'linear-gradient(90deg, #a10003, #002887)',
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}>Celulares disponibles
                            </ModalHeader>
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
