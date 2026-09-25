import { Button, Input, Textarea } from "@heroui/react";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader
} from "@heroui/modal";
import { useEffect, useState } from "react";
import { Progress } from "@heroui/react";
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import React from "react";

type Reporte = {
    id_reporte: number;
    fecha_creacion: string;
    referencia: string;
    nombre_operador: string;
    atendido: boolean;
    comentarios_monitorista: string;
    unidad: string;
    comentarios_operador: string;
    nombre_usuario_resolvio: string;
    fecha_atendido: string;
}

type Props = {
    id_reporte: number;
    isOpen: boolean;
    onOpenChange: () => void;
};

const ReporteOperador: React.FC<Props> = ({
    id_reporte,
    isOpen,
    onOpenChange
}) => {

    const [isLoading, setLoading] = useState(false);
    const [data, setData] = useState<Reporte>();

    const getEstatus = async () => {
        if (!id_reporte) return;
        try {
            setLoading(true);
            const response = await odooApi.get('/problemas_operadores/id_reporte/' + id_reporte);
            setData(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error al obtener los datos:', error);
        }
    };

    useEffect(() => {
        getEstatus();
    }, [id_reporte, open]);

    const AtenderReporte = async () => {
        if (!data?.comentarios_monitorista) {
            toast.error("El comentario del monitorista es obligatorio.");
            return;
        }
        try {
            setLoading(true);
            const response = await odooApi.patch(
                `/problemas_operadores/atender/${data?.id_reporte}`,
                {
                    comentarios_monitorista: data?.comentarios_monitorista
                }
            );

            if (response.data) {
                toast.success(response.data.message);
                onOpenChange();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error en la comunicación con el servidor: " + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="5xl"
            scrollBehavior="outside"
            classNames={{
                base: "bg-[#f8fafc]",
                header: "border-b border-slate-200",
                body: "py-6",
            }}
        >
            <ModalContent>
                {() => (
                    <>
                        {/* HEADER */}
                        <ModalHeader className="px-6 py-5">
                            <div className="w-full flex items-center justify-between gap-4">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#002887] text-white">
                                        <i className="bi bi-exclamation-triangle-fill text-lg" />
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-800">
                                            Reporte de operador
                                        </h2>

                                        <p className="mt-0.5 text-sm text-slate-500">
                                            Consulta y atención de incidencia operacional
                                        </p>
                                    </div>

                                </div>

                                {data && (
                                    <div
                                        className={`
                                            rounded-full px-3 py-1.5 text-xs font-semibold
                                            ${data.atendido
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-amber-50 text-amber-700"
                                            }
                                        `}
                                    >
                                        {data.atendido
                                            ? "ATENDIDO"
                                            : "PENDIENTE"
                                        }
                                    </div>
                                )}

                            </div>
                        </ModalHeader>

                        {isLoading && (
                            <Progress
                                isIndeterminate
                                size="sm"
                                color="primary"
                            />
                        )}

                        <ModalBody className="px-6">

                            {/* ACCIONES */}
                            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">

                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            Atención del reporte
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Registra la respuesta y seguimiento de la incidencia.
                                        </p>
                                    </div>

                                    <Button
                                        isDisabled={data?.atendido === true}
                                        color="primary"
                                        onPress={AtenderReporte}
                                        radius="md"
                                        className="font-semibold text-white"
                                        isLoading={isLoading}
                                        startContent={
                                            <i className="bi bi-check-lg" />
                                        }
                                    >
                                        Atender reporte
                                    </Button>

                                </div>

                            </div>

                            {/* INFORMACIÓN GENERAL */}
                            <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">

                                <div className="border-b border-slate-200 px-5 py-4">
                                    <h3 className="text-sm font-semibold text-slate-800">
                                        Información del reporte
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Datos generales relacionados con la incidencia.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">

                                    <Input
                                        id="fecha_creacion"
                                        label="Fecha de creación"
                                        value={data?.fecha_creacion ?? ""}
                                        variant="bordered"
                                        isReadOnly
                                    />

                                    <Input
                                        id="referencia"
                                        label="Viaje"
                                        variant="bordered"
                                        isReadOnly
                                        value={data?.referencia ?? ""}
                                    />

                                    <Input
                                        id="nombre_operador"
                                        label="Operador"
                                        variant="bordered"
                                        isReadOnly
                                        value={data?.nombre_operador ?? ""}
                                    />

                                    <Input
                                        id="unidad"
                                        label="Unidad"
                                        variant="bordered"
                                        isReadOnly
                                        value={data?.unidad ?? ""}
                                    />

                                </div>

                            </div>

                            {/* DESCRIPCIÓN + ATENCIÓN */}
                            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">

                                {/* OPERADOR */}
                                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                                    <div className="border-b border-slate-200 px-5 py-4">
                                        <div className="flex items-center gap-2">

                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                                <i className="bi bi-person-fill" />
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-800">
                                                    Descripción del operador
                                                </h3>

                                                <p className="text-xs text-slate-500">
                                                    Información proporcionada al reportar la incidencia.
                                                </p>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="p-5">

                                        <Textarea
                                            id="comentarios_operador"
                                            label="Comentarios del operador"
                                            variant="bordered"
                                            minRows={7}
                                            isDisabled
                                            value={data?.comentarios_operador ?? ""}
                                        />

                                    </div>

                                </div>

                                {/* MONITORISTA */}
                                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                                    <div className="border-b border-slate-200 px-5 py-4">
                                        <div className="flex items-center gap-2">

                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#002887]">
                                                <i className="bi bi-headset" />
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-800">
                                                    Atención del monitorista
                                                </h3>

                                                <p className="text-xs text-slate-500">
                                                    Registra las acciones o comentarios realizados.
                                                </p>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="p-5">

                                        <Textarea
                                            isDisabled={data?.atendido === true}
                                            id="comentarios_monitorista"
                                            label="Comentarios del monitorista / ejecutivo"
                                            variant="bordered"
                                            minRows={7}
                                            name="comentarios_monitorista"
                                            value={data?.comentarios_monitorista ?? ""}
                                            onValueChange={(value) =>
                                                setData((prev) =>
                                                    prev
                                                        ? {
                                                            ...prev,
                                                            comentarios_monitorista: value,
                                                        }
                                                        : prev
                                                )
                                            }
                                        />

                                    </div>

                                </div>

                            </div>

                            {/* RESOLUCIÓN */}
                            {data?.atendido && (
                                <div className="mt-5 rounded-2xl border border-emerald-200 bg-white shadow-sm">

                                    <div className="border-b border-emerald-100 bg-emerald-50/50 px-5 py-4">

                                        <div className="flex items-center gap-2">

                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                                                <i className="bi bi-check-circle-fill" />
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-semibold text-emerald-800">
                                                    Información de resolución
                                                </h3>

                                                <p className="text-xs text-emerald-700/70">
                                                    Datos correspondientes al cierre de la incidencia.
                                                </p>
                                            </div>

                                        </div>

                                    </div>

                                    <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">

                                        <Input
                                            id="nombre_usuario_resolvio"
                                            label="Usuario que resolvió"
                                            variant="bordered"
                                            isReadOnly
                                            value={
                                                data?.nombre_usuario_resolvio ?? ""
                                            }
                                        />

                                        <Input
                                            id="fecha_atendido"
                                            label="Fecha de atención"
                                            variant="bordered"
                                            isReadOnly
                                            value={
                                                data?.fecha_atendido ?? ""
                                            }
                                        />

                                    </div>

                                </div>
                            )}

                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default ReporteOperador;