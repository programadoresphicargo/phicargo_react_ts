import {
    Alert,
    Card,
    CardBody,
    Chip,
    Progress,
} from "@heroui/react";
import { useContext, useEffect, useState } from "react";
import odooApi from "@/api/odoo-api";
import { toast } from "react-toastify";
import { ViajeContext } from "./context/viajeContext";

// ============================================================
// TIPOS
// ============================================================

type ArrivalStatus =
    | "arrived_early"
    | "arrived_late"
    | "arrived_late_justified"
    | "arrived_late_partially_justified"
    | "no_arrival_recorded"
    | "no_info";

type Viaje = {
    referencia: string;
    llegada_planta: string;
    llegada_planta_programada: string;
    diferencia_tiempo_llegada: string;
    arrival_status: ArrivalStatus;
    llegada_limite: string;
    retraso_final: number;
    justified_minutes: number;
    retraso_real_planta: number;
};

type StatusConfig = {
    label: string;
    color: "success" | "danger" | "warning" | "default";
    description: string;
};

// ============================================================
// ICONOS
// ============================================================

const CalendarIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
    >
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
);

const ClockIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
    >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
    </svg>
);

const CheckIcon = () => (
    <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="m5 12 4 4L19 6" />
    </svg>
);

const WarningIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M12 3 2.5 20h19L12 3Z" />
        <path d="M12 9v5M12 17h.01" />
    </svg>
);

const InfoIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
    >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 10v6M12 7h.01" />
    </svg>
);

// ============================================================
// COMPONENTE
// ============================================================

function LlegadaTarde() {
    const { id_viaje } = useContext(ViajeContext);

    const [data, setData] = useState<Viaje | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // ========================================================
    // CONFIGURACIÓN DE ESTADOS
    // ========================================================

    const arrivalStatusMap: Record<ArrivalStatus, StatusConfig> = {
        arrived_early: {
            label: "Llegada en tiempo",
            color: "success",
            description:
                "La unidad llegó dentro del tiempo establecido.",
        },

        arrived_late: {
            label: "Llegada fuera de tiempo",
            color: "danger",
            description:
                "La llegada excedió el límite establecido.",
        },

        arrived_late_justified: {
            label: "Llegada justificada",
            color: "warning",
            description:
                "El retraso registrado cuenta con justificación.",
        },

        arrived_late_partially_justified: {
            label: "Retraso parcialmente justificado",
            color: "danger",
            description:
                "La justificación no cubre la totalidad del retraso.",
        },

        no_arrival_recorded: {
            label: "Sin registro de llegada",
            color: "default",
            description:
                "No se cuenta con un registro de llegada para este viaje.",
        },

        no_info: {
            label: "Sin información",
            color: "default",
            description:
                "No existe información suficiente para determinar el estado.",
        },
    };

    // ========================================================
    // CONSULTA
    // ========================================================

    const fetchData = async () => {
        if (!id_viaje) return;

        setIsLoading(true);

        try {
            const response = await odooApi.get(
                `/tms_travel/departures-arrivals/?travel_id=${id_viaje}`
            );

            setData(response.data);
        } catch (error: any) {
            toast.error(
                "Error al obtener los datos: " +
                (error?.message || "Error desconocido")
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id_viaje]);

    // ========================================================
    // LOADING
    // ========================================================

    if (isLoading) {
        return (
            <Card
                shadow="none"
                radius="lg"
                className="border border-default-200 mb-3"
            >
                <CardBody className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center text-primary">
                            <ClockIcon />
                        </div>

                        <div>
                            <p className="font-semibold text-sm">
                                Evaluación de llegada
                            </p>

                            <p className="text-xs text-default-500">
                                Consultando información del viaje...
                            </p>
                        </div>
                    </div>

                    <Progress
                        color="primary"
                        isIndeterminate
                        size="sm"
                        aria-label="Cargando información"
                    />
                </CardBody>
            </Card>
        );
    }

    if (!data) return null;

    const status =
        arrivalStatusMap[data.arrival_status] ??
        arrivalStatusMap.no_info;

    const hasPenalty =
        data.arrival_status === "arrived_late" ||
        data.arrival_status === "arrived_late_partially_justified";

    const isOnTime =
        data.arrival_status === "arrived_early";

    // ========================================================
    // COLOR DEL ICONO PRINCIPAL
    // ========================================================

    const statusIcon =
        status.color === "success" ? (
            <CheckIcon />
        ) : status.color === "danger" ? (
            <WarningIcon />
        ) : status.color === "warning" ? (
            <ClockIcon />
        ) : (
            <InfoIcon />
        );

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <Card
            radius="lg"
            shadow="sm"
            className="border border-slate-200 overflow-hidden mb-5"
        >
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="px-5 py-4 border-b border-default-200 bg-default-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div className="flex items-center gap-3">

                        <div
                            className={`
                                w-11 h-11 rounded-xl
                                flex items-center justify-center
                                ${status.color === "success"
                                    ? "bg-success-50 text-success"
                                    : status.color === "danger"
                                        ? "bg-danger-50 text-danger"
                                        : status.color === "warning"
                                            ? "bg-warning-50 text-warning"
                                            : "bg-default-100 text-default-500"
                                }
                            `}
                        >
                            {statusIcon}
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-default-500">
                                Control de llegada
                            </p>

                            <h3 className="text-base font-semibold text-default-900">
                                Evaluación de llegada a planta
                            </h3>
                        </div>
                    </div>

                    <Chip
                        color={status.color}
                        variant="flat"
                        size="sm"
                        className="font-semibold w-fit"
                    >
                        {status.label}
                    </Chip>
                </div>
            </div>

            {/* ==================================================
                BODY
            ================================================== */}

            <CardBody className="p-5">

                {/* ESTADO */}

                <div
                    className={`
                        rounded-xl border px-4 py-3 mb-5
                        ${status.color === "success"
                            ? "bg-success-50/50 border-success-100"
                            : status.color === "danger"
                                ? "bg-danger-50/50 border-danger-100"
                                : status.color === "warning"
                                    ? "bg-warning-50/50 border-warning-100"
                                    : "bg-default-50 border-default-200"
                        }
                    `}
                >
                    <div className="flex items-start gap-3">

                        <div className="mt-0.5">
                            {statusIcon}
                        </div>

                        <div>
                            <p className="font-semibold text-sm">
                                {status.label}
                            </p>

                            <p className="text-xs text-default-600 mt-0.5">
                                {status.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    INFORMACIÓN DEL VIAJE
                ================================================== */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 mb-5">

                    {/* PROGRAMADA */}

                    <InfoItem
                        icon={<CalendarIcon />}
                        label="Llegada programada"
                        value={data.llegada_planta_programada}
                    />

                    {/* REAL */}

                    <InfoItem
                        icon={<CheckIcon />}
                        label="Llegada real"
                        value={data.llegada_planta}
                    />

                    {/* LIMITE */}

                    <InfoItem
                        icon={<ClockIcon />}
                        label="Hora límite"
                        value={data.llegada_limite}
                    />
                </div>

                {/* ==================================================
                    MÉTRICAS
                ================================================== */}

                <div className="border-t border-default-200 pt-5">

                    <div className="flex items-center justify-between mb-3">

                        <div>
                            <p className="text-sm font-semibold text-default-900">
                                Análisis del retraso
                            </p>

                            <p className="text-xs text-default-500">
                                Desglose de los minutos registrados
                            </p>
                        </div>

                        {isOnTime && (
                            <Chip
                                size="sm"
                                color="success"
                                variant="flat"
                                startContent={<CheckIcon />}
                            >
                                En tiempo
                            </Chip>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                        {/* RETRASO REAL */}

                        <MetricCard
                            label="Retraso real"
                            value={`${data.retraso_real_planta}`}
                            suffix="min"
                            description="Tiempo total excedido"
                            type={
                                data.retraso_real_planta > 0
                                    ? "danger"
                                    : "success"
                            }
                        />

                        {/* JUSTIFICADO */}

                        <MetricCard
                            label="Minutos justificados"
                            value={`${data.justified_minutes}`}
                            suffix="min"
                            description="Tiempo reconocido"
                            type="warning"
                        />

                        {/* RETRASO FINAL */}

                        <MetricCard
                            label="Retraso final"
                            value={`${data.retraso_final}`}
                            suffix="min"
                            description="Tiempo considerado"
                            type={
                                data.retraso_final > 0
                                    ? "danger"
                                    : "success"
                            }
                        />
                    </div>
                </div>

                {/* ==================================================
                    PENALIZACIÓN
                ================================================== */}

                {hasPenalty && (
                    <Alert
                        className="mt-5"
                        color="danger"
                        variant="flat"
                        radius="lg"
                        title="Descuento aplicable"
                        description={
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <span>
                                    De acuerdo con el resultado de la
                                    evaluación, aplica un descuento.
                                </span>

                                <strong className="whitespace-nowrap text-sm">
                                    $1,000.00 MXN
                                </strong>
                            </div>
                        }
                    />
                )}

                {/* ==================================================
                    SIN PENALIZACIÓN
                ================================================== */}

                {isOnTime && (
                    <div className="mt-5 flex items-center gap-2 px-4 py-3 rounded-xl bg-success-50 border border-success-100 text-success-700">
                        <CheckIcon />

                        <span className="text-xs font-medium">
                            La llegada se encuentra dentro del tiempo
                            establecido y no genera penalización.
                        </span>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}

// ============================================================
// INFO ITEM
// ============================================================

type InfoItemProps = {
    icon: React.ReactNode;
    label: string;
    value?: string | number;
};

function InfoItem({
    icon,
    label,
    value,
}: InfoItemProps) {
    return (
        <div className="rounded-xl border border-default-200 bg-white px-4 py-3">

            <div className="flex items-center gap-2 mb-1.5 text-default-400">
                {icon}

                <span className="text-[11px] font-medium uppercase tracking-wide">
                    {label}
                </span>
            </div>

            <p className="text-sm font-semibold text-default-900 truncate">
                {value || "—"}
            </p>
        </div>
    );
}

// ============================================================
// METRIC CARD
// ============================================================

type MetricCardProps = {
    label: string;
    value: string;
    suffix: string;
    description: string;
    type: "success" | "danger" | "warning";
};

function MetricCard({
    label,
    value,
    suffix,
    description,
    type,
}: MetricCardProps) {
    const styles = {
        success: {
            wrapper:
                "border-success-100 bg-success-50/40",
            value: "text-success-600",
        },

        danger: {
            wrapper:
                "border-danger-100 bg-danger-50/40",
            value: "text-danger-600",
        },

        warning: {
            wrapper:
                "border-warning-100 bg-warning-50/40",
            value: "text-warning-600",
        },
    };

    return (
        <div
            className={`
                rounded-xl border p-4
                ${styles[type].wrapper}
            `}
        >
            <p className="text-xs font-medium text-default-600">
                {label}
            </p>

            <div className="flex items-baseline gap-1 mt-1">

                <span
                    className={`
                        text-2xl font-bold
                        ${styles[type].value}
                    `}
                >
                    {value}
                </span>

                <span className="text-xs font-medium text-default-500">
                    {suffix}
                </span>
            </div>

            <p className="text-[11px] text-default-500 mt-1">
                {description}
            </p>
        </div>
    );
}

export default LlegadaTarde;