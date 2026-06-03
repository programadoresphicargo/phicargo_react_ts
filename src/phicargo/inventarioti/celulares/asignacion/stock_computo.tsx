import odooApi from "@/api/odoo-api";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Box from '@mui/material/Box';
import { EquipoComputo } from "../equipo_computo/form";
import { FieldArrayWithId, UseFieldArrayAppend } from "react-hook-form";
import { AsignacionActivo } from "./form";

interface EquipoComputoProps {
    isOpen: boolean;
    onOpenChange: () => void;
    equiposFields: FieldArrayWithId<AsignacionActivo, "equipo_computo", "id">[];
    appendEquipo: UseFieldArrayAppend<AsignacionActivo, "equipo_computo">;
}

export default function StockComputo({ isOpen, onOpenChange, equiposFields, appendEquipo }: EquipoComputoProps) {

    const [isLoading, setLoading] = useState(false);

    const [data, setData] = useState<EquipoComputo[]>([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get<EquipoComputo[]>('/inventarioti/dispositivos/computo/true');
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
    }, [isOpen]);

    const columns = useMemo(
        () => [
            { accessorKey: 'nombre', header: 'Empresa' },
            { accessorKey: 'sn', header: 'SN' },
            { accessorKey: 'marca', header: 'Marca' },
            { accessorKey: 'modelo', header: 'Modelo' },
            { accessorKey: 'so', header: 'so' },
            { accessorKey: 'estado', header: 'Estado' },
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
                const existe = (equiposFields || []).some(
                    cel => cel.id_ec === row.original.id_ec
                );

                if (existe) {
                    toast.error("El equipo ya está dentro");
                    return;
                }

                appendEquipo(row.original);
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
                    Equipos disponibles
                </h1>
            </Box>
        ),
    });

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="5xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1"
                                style={{
                                    background: 'linear-gradient(90deg, #a10003, #002887)',
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}>Equipo de computo disponible
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
