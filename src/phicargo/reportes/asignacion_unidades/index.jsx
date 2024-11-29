import React, { useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import axios from 'axios';
import Badge from 'react-bootstrap/Badge';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PaginaConDialog from './informacion';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import MonitoreoNavbar from '../../monitoreo/Navbar';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Slide from '@mui/material/Slide';

const AsignacionUnidades = () => {

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    const [open, setOpen] = useState(false);
    const [id_vehicle, setIDVehicle] = useState('');
    const [vehicle_name, setNameVehicle] = useState('');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/phicargo/reportes/unidades/getData.php');
            setData(response.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    };

    const columns = [
        { accessorKey: 'empresa', header: 'Empresa' },
        { accessorKey: 'sucursal', header: 'Sucursal' },
        { accessorKey: 'name2', header: 'Unidad' },
        {
            accessorKey: 'operador_asignado',
            header: 'Operador asignado',
            Cell: ({ cell }) => cell.getValue() ? cell.getValue() : 'SIN OPERADOR ASIGNADO',
        },
        {
            accessorKey: 'x_tipo_vehiculo', header: 'Tipo de vehículo', Cell: ({ cell }) => {
                const value = cell.getValue();

                let variant = 'secondary';
                if (value === 'info') {
                    variant = 'success';
                } else if (value === 'carretera') {
                    variant = 'primary';
                }

                return (
                    <span className={`badge bg-${variant} rounded-pill`} style={{ width: '80px' }}>
                        {value}
                    </span>
                );
            },
        },
        { accessorKey: 'x_tipo_carga', header: 'Tipo de carga' },
        {
            accessorKey: 'x_modalidad', header: 'Modalidad',
            Cell: ({ cell }) => {
                const value = cell.getValue();

                let variant = 'secondary';
                if (value === 'sencillo') {
                    variant = 'success';
                } else if (value === 'full') {
                    variant = 'danger';
                }

                return (
                    <span className={`badge bg-${variant} rounded-pill`} style={{ width: '80px' }}>
                        {value}
                    </span>
                );
            },
        },
        { accessorKey: 'estado_unidad', header: 'Estado' },
    ];

    const exportToExcel = () => {
        // Formatear los datos antes de exportarlos
        const formattedData = data.map(row => ({
            Sucursal: row.sucursal,
            Unidad: row.name2,
            'Operador asignado': row.operador_asignado ? row.operador_asignado : 'SIN OPERADOR ASIGNADO',
            'Tipo de vehículo': row.x_tipo_vehiculo,
            'Tipo de carga': row.x_tipo_carga,
            Modalidad: row.x_modalidad,
            Estado: row.estado_unidad,
        }));

        // Crear una hoja de trabajo y libro para exportar a Excel
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'DatosTabla');

        // Escribir el archivo en formato Excel
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // Crear un Blob con los datos del archivo Excel
        const excelData = new Blob([excelBuffer], { type: 'application/octet-stream' });

        // Usar la librería FileSaver.js para guardar el archivo
        saveAs(excelData, 'tabla.xlsx');
    };


    return (<>
        <div>
            <Dialog open={open} onClose={handleClose}
                fullScreen
            >
                <AppBar sx={{ position: 'relative' }} elevation={0}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Button autoFocus color="inherit" onClick={handleClose}>
                            Cerrar
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <PaginaConDialog onClose={handleClose} id={id_vehicle} name={vehicle_name} />
                </DialogContent>
            </Dialog>

            <MonitoreoNavbar></MonitoreoNavbar>
            <MaterialReactTable
                columns={columns}
                data={data}
                state={{ isLoading: loading }}
                enableGrouping
                enableRowSelection
                columnFilterDisplayMode='popover'
                paginationDisplayMode='pages'
                positionToolbarAlertBanner='bottom'
                muiTableBodyRowProps={({ row }) => ({
                    onClick: () => {
                        handleClickOpen();
                        setIDVehicle(row.original.id_vehicle);
                        setNameVehicle(row.original.name2);
                    },
                    sx: {
                        cursor: 'pointer',
                    },
                })}
                initialState={{
                    density: 'compact',
                    pagination: { pageSize: 80 },
                }}
                muiTableHeadCellProps={{
                    sx: {
                        fontFamily: 'Inter',
                        fontWeight: 'Bold',
                        fontSize: '14px',
                    },
                }}
                muiTableBodyCellProps={{
                    sx: {
                        fontFamily: 'Inter',
                        fontWeight: 'normal',
                        fontSize: '14px',
                    },
                }}
                renderTopToolbarCustomActions={() => (
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '16px',
                            padding: '8px',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Button variant="contained" startIcon={<FileDownloadIcon />} onClick={exportToExcel}>
                            Exportar a Excel
                        </Button>
                    </Box>
                )}
            />
        </div >
    </>
    );
};

export default AsignacionUnidades;
