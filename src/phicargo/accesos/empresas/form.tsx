import { useState } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import odooApi from '@/api/odoo-api';

import { toast } from 'react-toastify';

import { Button, Input } from '@heroui/react';

type Props = {
    open: boolean;
    handleClose: () => void;
};

const FormEmpresa: React.FC<Props> = ({
    open,
    handleClose,
}) => {
    const [nombreEmpresa, setNombreEmpresa] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const inputValue = e.target.value;

        // Permite letras, acentos, ñ, ü y espacios
        if (
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/.test(inputValue)
        ) {
            setNombreEmpresa(inputValue);
        }
    };

    const añadirEmpresa = async () => {
        const nombre = nombreEmpresa.trim();

        if (!nombre) {
            toast.error(
                'El nombre de la empresa no puede estar vacío.',
            );
            return;
        }

        if (nombre.length < 3) {
            toast.error(
                'Ingresa un nombre de empresa válido.',
            );
            return;
        }

        try {
            setIsLoading(true);

            const response = await odooApi.post(
                '/empresas_visitantes/',
                {
                    empresa: nombre,
                },
            );

            if (response.data.status === 'success') {
                toast.success(
                    response.data.message ||
                    'Empresa registrada correctamente.',
                );

                setNombreEmpresa('');
                handleClose();
            } else {
                toast.error(
                    response.data.message ||
                    'No fue posible registrar la empresa.',
                );
            }
        } catch (error: any) {
            if (error.response?.data?.detail) {
                toast.error(error.response.data.detail);
            } else {
                toast.error(
                    'Error al conectar con el servidor: ' +
                    error.message,
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDialogClose = () => {
        if (isLoading) return;

        setNombreEmpresa('');
        handleClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleDialogClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow:
                        '0 20px 50px rgba(15, 23, 42, 0.15)',
                },
            }}
        >
            {/* HEADER */}
            <DialogTitle
                className="border-b border-slate-200 bg-white px-6 py-4"
                sx={{
                    fontFamily: 'Inter, sans-serif',
                }}
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#002887]/10">
                        <i className="bi bi-building-add text-lg text-[#002887]" />
                    </div>

                    <div className="min-w-0">
                        <h2 className="text-sm font-semibold text-slate-800">
                            Nueva empresa
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                            Registra una empresa para asociarla a los
                            visitantes.
                        </p>
                    </div>
                </div>
            </DialogTitle>

            {/* CONTENT */}
            <DialogContent
                className="bg-[#f8fafc] px-6 pb-6"
                sx={{
                    fontFamily: 'Inter, sans-serif',
                }}
            >
                <div className="pt-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-4">

                        {/* SECCIÓN */}
                        <div className="mb-4 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                                <i className="bi bi-building text-sm text-slate-600" />
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-slate-700">
                                    Información de la empresa
                                </p>

                                <p className="text-[11px] text-slate-400">
                                    Captura el nombre con el que será registrada.
                                </p>
                            </div>
                        </div>

                        {/* INPUT */}
                        <Input
                            autoFocus
                            isRequired
                            id="nombre_empresa"
                            name="nombre_empresa"
                            label="Nombre de la empresa"
                            placeholder="Ej. Transportes del Golfo"
                            variant="bordered"
                            value={nombreEmpresa}
                            onChange={handleChange}
                            maxLength={150}
                            isDisabled={isLoading}
                            classNames={{
                                label: 'text-xs font-medium text-slate-600',
                                input: 'text-sm',
                            }}
                        />

                        {/* AYUDA */}
                        <div className="mt-2 flex items-center gap-2">
                            <i className="bi bi-info-circle text-xs text-slate-400" />

                            <span className="text-[11px] text-slate-400">
                                Solo se permiten letras, acentos, ñ y espacios.
                            </span>
                        </div>
                    </div>
                </div>
            </DialogContent>

            {/* FOOTER */}
            <DialogActions
                className="border-t border-slate-200 bg-white px-6 py-4"
                sx={{
                    fontFamily: 'Inter, sans-serif',
                }}
            >
                <div className="flex w-full items-center justify-end gap-2">
                    <Button
                        variant="bordered"
                        radius="md"
                        onPress={handleDialogClose}
                        isDisabled={isLoading}
                        className="border-slate-300 bg-white text-slate-600"
                    >
                        Cancelar
                    </Button>

                    <Button
                        color="primary"
                        radius="md"
                        onPress={añadirEmpresa}
                        isLoading={isLoading}
                        className="bg-[#002887] font-medium"
                        startContent={
                            !isLoading ? (
                                <i className="bi bi-building-add" />
                            ) : undefined
                        }
                    >
                        Registrar empresa
                    </Button>
                </div>
            </DialogActions>
        </Dialog>
    );
};

export default FormEmpresa;