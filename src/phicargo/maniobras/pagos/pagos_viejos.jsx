import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import customFontTheme from '../../../theme';
import Nomina_form from './form_pago';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import ManiobrasNavBar from '../Navbar';
import { Box } from '@mui/system';
import { Button } from '@heroui/react';
import { ManiobraProvider } from '../context/viajeContext';
const { VITE_PHIDES_API_URL } = import.meta.env;

const NominasViejas = () => {

    const [isLoading2, setLoading] = useState();

    const handleChange = (event) => {
    };

    const [modalShow, setModalShow] = useState(false);
    const [id_pago, setIDPago] = useState('');
    const [id_operador, setIDOperador] = useState('');
    const [fecha_inicio, setFechainicio] = useState('');
    const [fecha_fin, setFechafin] = useState('');
    const [disabled, setDisabled] = useState(false);

    const handleShowModal = () => {
        setDisabled(false);
        setModalShow(true);
        setIDPago(null);
        setIDOperador(null);
        setFechainicio(null);
        setFechafin(null);
    };

    const handleCloseModal = async () => {
        setModalShow(false);
        await fetchData();
    };

    const [data, setData] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('operador_id', '1070');

            const response = await fetch(VITE_PHIDES_API_URL + '/modulo_maniobras/pagos/getPagos.php', {
                method: 'POST',
                body: formData,
            });

            const jsonData = await response.json();
            setData(jsonData);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id_pago',
                header: 'ID Pago',
            },
            {
                accessorKey: 'name',
                header: 'Conductor',
            },
            {
                accessorKey: 'fecha_pago',
                header: 'Fecha de pago',
            },
            {
                accessorKey: 'periodo_inicio',
                header: 'Periodo inicio',
            },
            {
                accessorKey: 'periodo_fin',
                header: 'Periodo fin',
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
        initialState: {
            groupBy: ['store_id'],
            density: 'compact',
            pagination: { pageSize: 80 },
        },
        state: { isLoading: isLoading2 },
        muiCircularProgressProps: {
            color: 'primary',
            thickness: 5,
            size: 45,
        },
        muiSkeletonProps: {
            animation: 'pulse',
            height: 28,
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: ({ event }) => {
                handleShowModal();
                setIDPago(row.original.id_pago);
                setIDOperador(row.original.id_operador);
                setFechainicio(row.original.periodo_inicio);
                setFechafin(row.original.periodo_fin);
                setDisabled(true);
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
        muiTableBodyCellProps: {
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'normal',
                fontSize: '14px',
            },
        },
        muiTableContainerProps: {
            sx: {
                maxHeight: 'calc(100vh - 200px)',
            },
        },
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    alignItems: 'center',
                }}
            >
                <Button color='primary' onPress={handleShowModal}>Nuevo registro de pago</Button>
            </Box >
        ),
    });

    return (
        <div>
            <ManiobraProvider>
                <ManiobrasNavBar />
                <Nomina_form
                    show={modalShow}
                    handleClose={handleCloseModal}
                    id_pago={id_pago}
                    id_operador={id_operador}
                    fecha_inicio={fecha_inicio}
                    fecha_fin={fecha_fin}
                    disabled={disabled} />
                <ThemeProvider theme={customFontTheme}>
                    <MaterialReactTable table={table} />
                </ThemeProvider>
            </ManiobraProvider>
        </div >
    );

};

export default NominasViejas;
