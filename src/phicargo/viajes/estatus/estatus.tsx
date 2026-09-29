
import {
    Avatar,
    Button,
    Card,
    Chip,
    Input,
    Progress,
} from "@heroui/react";

import { useContext, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import EstatusHistorialAgrupado from "./estatus_agrupados";
import { ViajeContext } from "../context/viajeContext";
import odooApi from "@/api/odoo-api";
import { tiempoTranscurrido } from "../../funciones/tiempo";

const { VITE_ODOO_API_URL } = import.meta.env;

type EstatusHistorial = {
    nombre_estatus: string;
    tipo_registrante: string;
    ultima_fecha_envio: string;
    nombre_registrante: string;
    imagen: string;
    registros: number;
    id_reportes_agrupados: number[] | number;
};

function EstatusHistorial() {
    const {
        id_viaje,
        drawerOpen,
        setDrawerOpen,
    } = useContext(ViajeContext);

    const [id_reportes_agrupados, setEstatusAgrupados] = useState<number[]>([]);
    const [estatusHistorial, setHistorial] = useState<EstatusHistorial[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [isLoading, setLoading] = useState(false);

    const handleClickOpen = (registros: number[] | number) => {
        const ids = Array.isArray(registros)
            ? registros
            : [registros];

        setEstatusAgrupados(ids);
        setDrawerOpen(true);
    };

    const getHistorialEstatus = async () => {
        try {
            setLoading(true);

            const response = await odooApi.get(
                `/tms_travel/reportes_estatus_viajes/by_id_viaje/${id_viaje}`
            );

            setHistorial(response.data);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getHistorialEstatus();
    }, [id_viaje]);

    const filteredHistorial = estatusHistorial.filter((item) =>
        item.nombre_estatus
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
        item.nombre_registrante
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const sortedHistorial = [...filteredHistorial].sort((a, b) => {
        const fechaA = new Date(a.ultima_fecha_envio).getTime();
        const fechaB = new Date(b.ultima_fecha_envio).getTime();

        return sortOrder === "asc"
            ? fechaA - fechaB
            : fechaB - fechaA;
    });

    const toggleSortOrder = () => {
        setSortOrder((prev) =>
            prev === "asc" ? "desc" : "asc"
        );
    };

    const generarReporte = async () => {
        try {
            const response = await odooApi.get(
                `/tms_travel/reportes_estatus_viajes/excel/${id_viaje}`,
                {
                    responseType: "blob",
                }
            );

            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `historial_estatus_${id_viaje}.csv`;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert("Error al generar el reporte");
            console.error(error);
        }
    };

    const exportPDF = () => {
        window.open(
            `${odooApi.defaults.baseURL}/tms_travel/reportes_estatus_viajes/pdf/${id_viaje}`,
            "_blank"
        );
    };

    const getTipoConfig = (tipo: string) => {
        switch (tipo) {
            case "automatico":
                return {
                    label: "Automático",
                    color: "primary" as const,
                    icon: "bi-gear",
                };

            case "usuario":
                return {
                    label: "Usuario",
                    color: "secondary" as const,
                    icon: "bi-person",
                };

            case "operador":
                return {
                    label: "Operador",
                    color: "success" as const,
                    icon: "bi-person-badge",
                };

            default:
                return {
                    label: tipo,
                    color: "default" as const,
                    icon: "bi-person",
                };
        }
    };

    const formatFecha = (fecha: string) => {
        try {
            return new Intl.DateTimeFormat("es-MX", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }).format(new Date(fecha));
        } catch {
            return fecha;
        }
    };

    return (
        <>
            {/* =========================================================
                MODAL
            ========================================================= */}

            <Dialog
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle
                    sx={{
                        background:
                            "linear-gradient(90deg, #002887 0%, #0059b3 100%)",
                        color: "#fff",
                        fontFamily: "Inter",
                        fontSize: "15px",
                        fontWeight: 600,
                        py: 1.5,
                    }}
                >
                    Detalles de estatus
                </DialogTitle>

                <DialogContent sx={{ pt: 2 }}>
                    <EstatusHistorialAgrupado
                        id_reportes_agrupados={id_reportes_agrupados}
                        id_viaje={id_viaje}
                    />
                </DialogContent>
            </Dialog>

            {/* =========================================================
                ENCABEZADO
            ========================================================= */}

            <div className="mb-4 overflow-hidden rounded-xl border border-default-200 bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-default-100 bg-gradient-to-r from-[#f8faff] to-white px-4 py-3">

                    <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                            <i className="bi bi-clock-history text-lg" />
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-default-800">
                                Historial operativo
                            </h3>

                            <p className="text-[11px] text-default-400">
                                Seguimiento cronológico del viaje
                            </p>
                        </div>

                    </div>

                    <Chip
                        size="sm"
                        variant="flat"
                        color="primary"
                        startContent={
                            <i className="bi bi-list-check text-[11px]" />
                        }
                    >
                        {sortedHistorial.length} eventos
                    </Chip>

                </div>

                {/* =====================================================
                    FILTROS
                ===================================================== */}

                <div className="flex flex-wrap items-center gap-2 px-4 py-3">

                    <Button
                        radius="sm"
                        size="sm"
                        color="primary"
                        variant="solid"
                        isDisabled={isLoading}
                        onPress={getHistorialEstatus}
                        startContent={
                            <i className="bi bi-arrow-clockwise" />
                        }
                    >
                        Actualizar
                    </Button>

                    <Input
                        radius="sm"
                        size="sm"
                        className="w-full sm:w-72"
                        isClearable
                        placeholder="Buscar estatus o registrante..."
                        aria-label="Buscar estatus"
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                        onClear={() => setSearchTerm("")}
                        startContent={
                            <i className="bi bi-search text-default-400" />
                        }
                    />

                    <Button
                        radius="sm"
                        size="sm"
                        variant="flat"
                        color="primary"
                        onPress={toggleSortOrder}
                        startContent={
                            <i
                                className={`bi ${sortOrder === "asc"
                                    ? "bi-sort-up"
                                    : "bi-sort-down"
                                    }`}
                            />
                        }
                    >
                        {sortOrder === "asc"
                            ? "Más antiguos"
                            : "Más recientes"}
                    </Button>

                    <div className="ml-auto flex gap-2">

                        <Button
                            radius="sm"
                            size="sm"
                            variant="flat"
                            color="success"
                            onPress={generarReporte}
                            startContent={
                                <i className="bi bi-file-earmark-excel" />
                            }
                        >
                            Excel
                        </Button>

                        <Button
                            radius="sm"
                            size="sm"
                            variant="flat"
                            color="danger"
                            onPress={exportPDF}
                            startContent={
                                <i className="bi bi-file-earmark-pdf" />
                            }
                        >
                            PDF
                        </Button>

                    </div>
                </div>
            </div>

            {/* =========================================================
                LOADING
            ========================================================= */}

            {isLoading && (
                <div className="mb-3 rounded-lg border border-primary-100 bg-primary-50/40 p-2">
                    <Progress
                        size="sm"
                        isIndeterminate
                        color="primary"
                    />
                </div>
            )}

            {/* =========================================================
                SIN REGISTROS
            ========================================================= */}

            {!isLoading && sortedHistorial.length === 0 && (
                <Card
                    shadow="none"
                    radius="lg"
                    className="border border-dashed border-default-200"
                >
                    <div className="flex flex-col items-center justify-center py-12">

                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-default-100">
                            <i className="bi bi-clock-history text-xl text-default-400" />
                        </div>

                        <p className="text-sm font-semibold text-default-600">
                            Sin movimientos
                        </p>

                        <p className="mt-1 text-xs text-default-400">
                            No existen registros que coincidan con la búsqueda.
                        </p>

                    </div>
                </Card>
            )}

            {/* =========================================================
                TIMELINE
            ========================================================= */}

            {!isLoading && sortedHistorial.length > 0 && (
                <div className="relative px-1 pb-4">

                    {/* Línea principal */}
                    <div
                        className="
                            absolute
                            left-[25px]
                            top-6
                            bottom-8
                            w-[2px]
                            bg-gradient-to-b
                            from-primary-500
                            via-primary-200
                            to-default-200
                        "
                    />

                    <div className="space-y-3">

                        {sortedHistorial.map((step, index) => {

                            const isFirst = index === 0;
                            const config = getTipoConfig(
                                step.tipo_registrante
                            );

                            return (
                                <div
                                    key={`${step.nombre_estatus}-${step.ultima_fecha_envio}-${index}`}
                                    className="relative flex gap-4"
                                >

                                    {/* =================================================
                                        NODO
                                    ================================================= */}

                                    <div className="relative z-10 flex w-[48px] shrink-0 justify-center">

                                        <div
                                            className={`
                                                flex
                                                h-12
                                                w-12
                                                items-center
                                                justify-center
                                                rounded-full
                                                border-[3px]
                                                border-white
                                                shadow-md
                                                ${isFirst
                                                    ? "bg-primary-600 ring-4 ring-primary-100"
                                                    : "bg-white shadow-sm"
                                                }
                                            `}
                                        >

                                            <div
                                                className={`
                                                    flex
                                                    h-9
                                                    w-9
                                                    items-center
                                                    justify-center
                                                    overflow-hidden
                                                    rounded-full
                                                    ${isFirst
                                                        ? "bg-primary-500"
                                                        : "bg-default-100"
                                                    }
                                                `}
                                            >

                                                <Avatar
                                                    src={
                                                        VITE_ODOO_API_URL +
                                                        `/assets/trafico/estatus_operativos/${step.imagen}`
                                                    }
                                                    size="sm"
                                                    radius="full"
                                                    color={config.color}
                                                    className="h-8 w-8"
                                                />

                                            </div>

                                        </div>

                                    </div>

                                    {/* =================================================
                                        CARD DEL EVENTO
                                    ================================================= */}

                                    <Card
                                        isPressable
                                        shadow="none"
                                        radius="lg"
                                        onPress={() =>
                                            handleClickOpen(
                                                step.id_reportes_agrupados
                                            )
                                        }
                                        className={`
                                            group
                                            mb-1
                                            min-w-0
                                            flex-1
                                            overflow-hidden
                                            border
                                            transition-all
                                            duration-200
                                            hover:-translate-y-[1px]
                                            hover:shadow-md
                                            ${isFirst
                                                ? "border-primary-200 bg-gradient-to-r from-primary-50/70 to-white"
                                                : "border-default-200 bg-white hover:border-primary-200"
                                            }
                                        `}
                                    >

                                        <div className="px-4 py-3">

                                            {/* =========================================
                                                CABECERA DEL EVENTO
                                            ========================================= */}

                                            <div className="flex items-start justify-between gap-4">

                                                <div className="min-w-0 flex-1">

                                                    <div className="mb-1 flex flex-wrap items-center gap-2">

                                                        <h4
                                                            className={`
                                                                truncate
                                                                text-[16px]
                                                                font-bold
                                                                ${isFirst
                                                                    ? "text-primary-700"
                                                                    : "text-default-800"
                                                                }
                                                            `}
                                                        >
                                                            {step.nombre_estatus}
                                                        </h4>

                                                        {isFirst && (
                                                            <Chip
                                                                size="sm"
                                                                color="primary"
                                                                variant="solid"
                                                                className="h-5 text-[9px] font-semibold"
                                                            >
                                                                ACTUAL
                                                            </Chip>
                                                        )}

                                                        {step.registros > 1 && (
                                                            <Chip
                                                                size="sm"
                                                                color="primary"
                                                                variant="flat"
                                                                className="h-5 text-[9px]"
                                                                startContent={
                                                                    <i className="bi bi-layers text-[9px]" />
                                                                }
                                                            >
                                                                {step.registros} registros
                                                            </Chip>
                                                        )}

                                                    </div>

                                                    {/* Registrante */}

                                                    <div className="flex items-center gap-2">

                                                        <Avatar
                                                            size="md"
                                                            name={
                                                                step.nombre_registrante?.charAt(0)
                                                            }
                                                            className="h-5 w-5 text-[10px] text-white"
                                                            color={config.color}
                                                        />

                                                        <span className="truncate text-[11px] font-medium text-default-600">
                                                            {step.nombre_registrante}
                                                        </span>

                                                        <span className="text-default-300">
                                                            /
                                                        </span>

                                                        <span className="flex items-center gap-1 text-[10px] text-default-400">

                                                            <i
                                                                className={`bi ${config.icon}`}
                                                            />

                                                            {config.label}

                                                        </span>

                                                    </div>

                                                </div>

                                                {/* =====================================
                                                    FECHA
                                                ===================================== */}

                                                <div className="hidden shrink-0 text-right sm:block">

                                                    <p className="text-[11px] font-semibold text-default-600">
                                                        {formatFecha(
                                                            step.ultima_fecha_envio
                                                        )}
                                                    </p>

                                                    <p
                                                        className={`
                                                            mt-0.5
                                                            text-[10px]
                                                            ${isFirst
                                                                ? "font-semibold text-primary-500"
                                                                : "text-default-400"
                                                            }
                                                        `}
                                                    >
                                                        {tiempoTranscurrido(
                                                            step.ultima_fecha_envio
                                                        )}
                                                    </p>

                                                </div>

                                            </div>

                                            {/* =========================================
                                                FOOTER DEL EVENTO
                                            ========================================= */}

                                        </div>

                                    </Card>

                                </div>
                            );
                        })}

                    </div>

                </div>
            )}

            {/* =========================================================
                FOOTER
            ========================================================= */}

            {!isLoading && sortedHistorial.length > 0 && (
                <div className="mt-2 flex items-center justify-between rounded-lg border border-default-100 bg-default-50/50 px-3 py-2">

                    <div className="flex items-center gap-2">

                        <div className="h-2 w-2 rounded-full bg-success-500" />

                        <span className="text-[10px] text-default-500">
                            Historial actualizado
                        </span>

                    </div>

                    <span className="text-[10px] text-default-400">
                        {sortedHistorial.length} eventos registrados
                    </span>

                </div>
            )}
        </>
    );
}

export default EstatusHistorial;
