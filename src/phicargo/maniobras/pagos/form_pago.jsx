import * as XLSX from 'xlsx';

import { Button, Card, CardBody } from '@heroui/react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Formulariomaniobra from '../maniobras/formulario_maniobra';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import SelectOperador from '../maniobras/select_operador';
import Swal from 'sweetalert2';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import { daDK } from '@mui/x-date-pickers/locales';
import { jsPDF } from 'jspdf';

const { VITE_PHIDES_API_URL } = import.meta.env;


const Nomina_form = ({ show, handleClose, id_pago, id_operador, fecha_inicio, fecha_fin, disabled }) => {

    const [form, setFormData] = useState({
        operador_id: '',
        periodo_inicio: '',
        periodo_fin: ''
    });

    useEffect(() => {
        if (id_operador !== null || fecha_inicio !== null || fecha_fin !== null) {
            setFormData({
                operador_id: id_operador !== null ? id_operador : '',
                periodo_inicio: fecha_inicio !== null ? fecha_inicio : '',
                periodo_fin: fecha_fin !== null ? fecha_fin : ''
            });
            fetchData();
        }
    }, [id_operador, fecha_inicio, fecha_fin]);

    useEffect(() => {
        if (form.operador_id && form.periodo_inicio && form.periodo_fin) {
            fetchData();
        }
    }, [form]);

    const exportToExcel = (table) => {
        const visibleColumns = table.getAllColumns().map((col) => col.columnDef.header); // Columnas visibles
        const visibleData = table.getRowModel().rows.map((row) =>
            row.getVisibleCells().map((cell) => cell.getValue()) // Datos visibles en la tabla
        );

        // Crear hoja de cálculo
        const worksheetData = [visibleColumns, ...visibleData]; // Combina encabezados y datos
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); // Convierte a hoja de cálculo
        const workbook = XLSX.utils.book_new(); // Crea un nuevo libro
        XLSX.utils.book_append_sheet(workbook, worksheet, 'TableData'); // Añadir la hoja
        XLSX.writeFile(workbook, 'maniobras-' + id_operador + '-' + fecha_inicio + '-' + fecha_fin + '.xlsx'); // Descarga el archivo Excel
    };

    const handleExportRows = (rows) => {
        const doc = new jsPDF();
        const tableData = rows.map((row) => Object.values(row.original));
        const tableHeaders = columns.map((c) => c.header);

        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
        });

        doc.save('mrt-pdf-example.pdf');
    };

    const registrar_pago = () => {
        toast.success('Registrando pagos, espere...');
        axios.post(VITE_PHIDES_API_URL + '/modulo_maniobras/pagos/registrar_pago.php', form)
            .then((response) => {
                var data = response.data;
                if (data.mensaje) {
                    toast.success(data.mensaje);
                    handleClose();
                } else if (data.error) {
                    toast.error(data.error);
                }
            })
            .catch((error) => {
                toast.error('Error en la solicitud:' + error);
                if (error.response) {
                    toast.error('Respuesta de error del servidor:' + error.response.data);
                } else if (error.request) {
                    toast.error('No se recibió respuesta del servidor:' + error.request);
                } else {
                    toast.error('Error al configurar la solicitud:' + error.message);
                }
            });
    };

    const handleSelectChange = (selectedOption) => {
        setFormData({
            ...form,
            operador_id: selectedOption ? selectedOption : ''
        });
    };

    const handleInputChange = (e) => {
        setFormData({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const [data, setData] = useState([]);
    const [isLoading2, setLoading] = useState();
    const [totalCantidad, setTotalCantidad] = useState(0);

    const fetchData = () => {
        setLoading(true);
        axios.post(VITE_PHIDES_API_URL + '/modulo_maniobras/pagos/getManiobras.php', form)
            .then((response) => {
                var data = response.data;
                setData(data);
                const totalMonto = data.reduce((sum, item) => sum + (parseFloat(item.precio_final) || 0), 0);
                setTotalCantidad(totalMonto);

                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                if (error.response) {
                    toast.error('Respuesta de error del servidor:' + error.response.data);
                } else if (error.request) {
                    toast.error('No se recibió respuesta del servidor:' + error.request);
                } else {
                    console.error('Error al configurar la solicitud:' + error.message);
                }
            });
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id_maniobra',
                header: 'ID MANIOBRA',
                minSize: 10,
            },
            {
                accessorKey: 'inicio_programado',
                header: 'INICIO PROGRAMADO',
            },
            {
                accessorKey: 'unidad',
                header: 'UNIDAD',
            },
            {
                accessorKey: 'tipo_maniobra',
                header: 'TIPO DE MANIOBRA',
            },
            {
                accessorKey: 'terminal',
                header: 'TERMINAL',
            },
            {
                accessorKey: 'tipo_armado',
                header: 'TIPO ARMADO',
            },
            {
                accessorKey: 'x_modo_bel',
                header: 'MODO',
            },
            {
                accessorKey: 'maniobra_peligrosa',
                header: 'PELIGROSO',
            },
            {
                accessorKey: 'contenedores',
                header: 'CONTENEDORES',
            },
            {
                accessorKey: 'clave',
                header: 'CLAVE',
            },
            {
                accessorKey: 'precio_final',
                header: 'PRECIO',
            },
        ],
        [],
    );

    const [modalShow, setModalShow] = useState(false);
    const [idManiobra, setIdManiobra] = useState('');
    const [idCP, setidCP] = useState('');
    const [idCliente, setidCliente] = useState('');

    const handleShowModal = () => {
        setModalShow(true);
    };

    const handleCloseModal = async () => {
        setModalShow(false);
        fetchData();
    };

    const table = useMaterialReactTable({
        columns,
        data,
        enableGrouping: true,
        enableGlobalFilter: true,
        enableFilters: true,
        initialState: {
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
        enableRowSelection: true,
        columnFilterDisplayMode: 'popover',
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '0',
            },
        },
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
        muiTableBodyRowProps: ({ row }) => ({
            onClick: ({ event }) => {
                handleShowModal();
                setIdManiobra(row.original.id_maniobra);
                setidCP(row.original.id_cp);
                setidCliente(row.original.partner_id);
            },
            style: {
                cursor: 'pointer',
            },
        }),
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <Button onClick={() => exportToExcel(table)} className='btn btn-success' color='primary'>
                    Exportar a Excel
                </Button>
            </Box>)
    });

    return (
        <>
            <Formulariomaniobra
                show={modalShow}
                handleClose={handleCloseModal}
                id_maniobra={idManiobra}
                id_cp={idCP}
                form_deshabilitado={true}
                id_cliente={idCliente}
            />

            <Dialog open={show} onClose={handleClose} fullScreen>

                <AppBar sx={{
                    background: 'linear-gradient(90deg, #0b2149, #002887)',
                    padding: '0 16px'
                }} position='static' elevation={0}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Registro de pago
                        </Typography>
                    </Toolbar>
                </AppBar>

                <DialogContent>

                    <div className="flex flex-wrap gap-2 items-center mt-5 mb-5">
                        <Button color='success' onPress={() => registrar_pago()} className='text-white'>Guardar nomina</Button>
                    </div>

                    <Box sx={{ flexGrow: 1 }} mb={4}>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <SelectOperador
                                    label={'Operador'}
                                    id={'operador_id'}
                                    name={'operador_id'}
                                    onChange={handleSelectChange}
                                    value={form.operador_id}
                                    disabled={disabled}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <label>Del: </label>
                                <input
                                    type='date'
                                    className="form-control"
                                    name="periodo_inicio"
                                    value={form.periodo_inicio}
                                    onChange={handleInputChange}
                                    disabled={disabled}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <label>Al:</label>
                                <input
                                    type='date'
                                    className="form-control"
                                    name="periodo_fin"
                                    onChange={handleInputChange}
                                    value={form.periodo_fin}
                                    disabled={disabled}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <div>
                                    <h1>Total a pagar: {totalCantidad}</h1>
                                </div>
                            </Grid>
                        </Grid>
                    </Box>

                    <Card>
                        <CardBody>
                            <MaterialReactTable table={table} />
                        </CardBody>
                    </Card>

                </DialogContent>
            </Dialog>
        </>
    );
};

export default Nomina_form;
