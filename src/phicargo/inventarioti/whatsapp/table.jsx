import React, { useState, useMemo } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Divider, useDisclosure } from "@heroui/react";
import Stack from '@mui/material/Stack';
import WhatsAppContatcsForm from "./form";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Box } from "@mui/material";

export default function WhatsAppContatcsTravel({ isOpen, onOpenChange }) {

    const {
        isOpen: isOpen1,
        onOpen: onOpen1,
        onOpenChange: onOpenChange1,
    } = useDisclosure();

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState([]);

    const columns = useMemo(
        () => [
            { accessorKey: 'empresa', header: 'Empresa' },
            { accessorKey: 'imei', header: 'IMEI' },
            { accessorKey: 'marca', header: 'Marca' },
            { accessorKey: 'modelo', header: 'Modelo' },
            { accessorKey: 'correo', header: 'Correo' },
            { accessorKey: 'passwoord', header: 'Contraseña' },
            {
                accessorKey: 'estado', header: 'Estado',
                Cell: ({ row }) => (
                    <Chip
                        className='text-white'
                        color={row.original.estado == 'disponible' ? 'success' : 'primary'}
                        variant="solid"
                        size='sm'
                    >
                        {row.original.estado}
                    </Chip >
                ),
            },
            { accessorKey: 'fecha_baja', header: 'Fecha baja' },
            { accessorKey: 'motivo_baja', header: 'Motivo baja' },
            { accessorKey: 'comentarios_baja', header: 'Comentarios baja' },
            { accessorKey: 'nombre_empleado_baja', header: 'Empleado baja' },
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
        state: {
            showProgressBars: isLoading,
        },
        initialState: {
            showGlobalFilter: true,
            density: 'compact',
            pagination: { pageSize: 80 },
            showColumnFilters: true,
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: ({ event }) => {
                setCelular(row.original.id_celular);
                onOpen();
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
                fontSize: '14px',
            },
        },
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100vh - 260px)',
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
                    Celulares
                </h1>
                <Button color="primary"
                    onPress={() => {
                        onOpen();
                        setCelular(null);
                    }}><i class="bi bi-plus-circle"></i>Nuevo</Button>

                <Button color="danger"
                    onPress={() => {
                        fetchData();
                    }}><i class="bi bi-arrow-clockwise"></i>Refrescar
                </Button>
            </Box >
        ),
    });

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl" radius="lg">
                <ModalContent>
                    <ModalHeader style={{ backgroundColor: '#25D366', color: 'white' }}>
                        <h1><i className="bi bi-whatsapp"></i> Contactos WhatsApp</h1>
                    </ModalHeader>
                    <Divider></Divider>
                    <ModalBody>

                        <Stack direction="row" spacing={2}>
                            <Button color="success" className="text-white" onPress={() => onOpen1()}>Registrar nuevo</Button>
                        </Stack>

                        <MaterialReactTable table={table} />

                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onPress={onOpenChange} className="text-white">
                            Cerrar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <WhatsAppContatcsForm isOpen={isOpen1} onOpenChange={onOpenChange1}></WhatsAppContatcsForm>
        </>
    );
}
