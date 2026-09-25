import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import odooApi from '@/api/odoo-api';

import { toast } from 'react-toastify';

import { Button, Input } from '@heroui/react';

interface FormVisitanteProps {
    open: boolean;
    handleClose: () => void;
    id_empresa: number;
}

export default function FormVisitante({
    open,
    handleClose,
    id_empresa,
}: FormVisitanteProps) {
    const [nombreVisitante, setNombreVisitante] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Permite letras, acentos, ñ y espacios
        if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/.test(value)) {
            setNombreVisitante(value);
        }
    };

    const registrarNuevoVisitante = async () => {
        const nombre = nombreVisitante.trim();

        if (!nombre) {
            toast.error('El nombre del visitante no puede estar vacío.');
            return;
        }

        if (nombre.length < 3) {
            toast.error('Ingresa el nombre completo del visitante.');
            return;
        }

        const dataToSend = {
            id_empresa,
            nombre_visitante: nombre,
        };

        try {
            setIsLoading(true);

            const response = await odooApi.post(
                '/visitantes/',
                dataToSend,
            );

            if (response.data.status === 'success') {
                toast.success(
                    response.data.message || 'Visitante registrado correctamente.',
                );

                setNombreVisitante('');
                handleClose();
            } else {
                toast.error(
                    response.data.message || 'No fue posible registrar al visitante.',
                );
            }
        } catch (error: any) {
            if (error.response?.data?.detail) {
                toast.error(error.response.data.detail);
            } else {
                toast.error(
                    'Error al conectar con el servidor: ' + error.message,
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDialogClose = () => {
        if (isLoading) return;

        setNombreVisitante('');
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
                    boxShadow: '0 20px 50px rgba(15, 23, 42, 0.15)',
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
                        <i className="bi bi-person-plus-fill text-lg text-[#002887]" />
                    </div>

                    <div className="min-w-0">
                        <h2 className="text-sm font-semibold text-slate-800">
                            Nuevo visitante
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                            Registra los datos del visitante para la empresa.
                        </p>
                    </div>
                </div>
            </DialogTitle>

            {/* CONTENT */}
            <DialogContent
                className="bg-[#f8fafc] px-6 pb-6 pt-7"
                sx={{
                    fontFamily: 'Inter, sans-serif',
                }}
            >
                <div className="space-y-4 mt-5">
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="mb-4 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                                <i className="bi bi-person-vcard text-sm text-slate-600" />
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-slate-700">
                                    Información del visitante
                                </p>

                                <p className="text-[11px] text-slate-400">
                                    Captura el nombre completo.
                                </p>
                            </div>
                        </div>

                        <Input
                            autoFocus
                            isRequired
                            id="nombre_visitante"
                            name="nombre_visitante"
                            label="Nombre completo"
                            placeholder="Ej. Juan Pérez García"
                            variant="bordered"
                            value={nombreVisitante}
                            onChange={handleChange}
                            maxLength={150}
                            isDisabled={isLoading}
                            classNames={{
                                label: 'text-xs font-medium text-slate-600',
                                input: 'text-sm',
                            }}
                        />

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
                        onPress={registrarNuevoVisitante}
                        isLoading={isLoading}
                        className="bg-[#002887] font-medium"
                        startContent={
                            !isLoading ? (
                                <i className="bi bi-person-plus" />
                            ) : undefined
                        }
                    >
                        Registrar visitante
                    </Button>
                </div>
            </DialogActions>
        </Dialog>
    );
}