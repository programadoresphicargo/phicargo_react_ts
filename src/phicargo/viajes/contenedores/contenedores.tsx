import { Avatar, Card, CardBody, Chip, Snippet, Spinner } from "@heroui/react";
import { useContext, useEffect, useState } from "react";
import { ViajeContext } from "../context/viajeContext";
import odooApi from "@/api/odoo-api";
import { toast } from "react-toastify";

type Contenedor = {
    name: string;
    x_reference: string;
    x_medida_bel: string;
};

function Contenedores() {
    const { id_viaje } = useContext(ViajeContext);

    const [data, setData] = useState<Contenedor[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);

        try {
            const response = await odooApi.get(
                "/tms_waybill/get_by_travel_id/" + id_viaje
            );

            setData(response.data);
        } catch (error) {
            toast.error("Error al obtener los contenedores: " + error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id_viaje]);

    return (
        <div className="w-full">
            {/* Loading */}
            {isLoading ? (
                <div className="flex min-h-[180px] items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <Spinner size="lg" color="primary" />
                        <span className="text-xs font-medium text-default-400">
                            Cargando contenedores...
                        </span>
                    </div>
                </div>
            ) : data.length === 0 ? (
                /* Empty state */
                <Card
                    shadow="sm"
                    className="border border-default-200 bg-white"
                >
                    <CardBody className="flex min-h-[150px] items-center justify-center">
                        <div className="flex flex-col items-center gap-2 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-default-100">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-default-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.7}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M20 13V7a2 2 0 00-1-1.732l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 7v6a2 2 0 001 1.732l7 4a2 2 0 002 0l7-4A2 2 0 0020 13z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"
                                    />
                                </svg>
                            </div>

                            <span className="text-sm font-semibold text-default-600">
                                Sin contenedores
                            </span>

                            <span className="text-xs text-default-400">
                                No hay contenedores asociados a este viaje.
                            </span>
                        </div>
                    </CardBody>
                </Card>
            ) : (
                <div className="space-y-2">
                    {/* Header */}
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-default-700">
                                Contenedores asignados
                            </h3>
                            <p className="text-xs text-default-400">
                                Unidades asociadas al viaje
                            </p>
                        </div>

                        <Chip
                            size="sm"
                            variant="flat"
                            color="primary"
                            className="font-semibold"
                        >
                            {data.length}{" "}
                            {data.length === 1
                                ? "contenedor"
                                : "contenedores"}
                        </Chip>
                    </div>

                    {/* Lista */}
                    {data.map((contenedor, index) => (
                        <Card
                            key={index}
                            shadow="none"
                            radius="sm"
                            className="
                                group
                                w-full
                                border
                                border-default-200
                                bg-white
                                transition-all
                                duration-200
                                hover:border-primary-200
                                hover:shadow-sm
                            "
                        >
                            <CardBody className="p-3">
                                <div className="flex items-center gap-3">
                                    {/* Icono */}
                                    <Avatar
                                        isBordered
                                        radius="sm"
                                        size="md"
                                        color="primary"
                                        src="https://cdn-icons-png.flaticon.com/512/6260/6260181.png"
                                        className="
                                            shrink-0
                                            bg-primary-50
                                            transition-transform
                                            duration-200
                                            group-hover:scale-105
                                        "
                                    />

                                    {/* Información principal */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="truncate text-sm font-semibold text-default-700">
                                                {contenedor.name}
                                            </h4>

                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                color="success"
                                                className="hidden h-5 text-[10px] font-semibold sm:flex"
                                            >
                                                ASIGNADO
                                            </Chip>
                                        </div>

                                        {/* Referencia */}
                                        <div className="mt-1 flex items-center gap-2">
                                            <span className="text-[10px] font-semibold uppercase tracking-wide text-default-400">
                                                Referencia
                                            </span>

                                            <Snippet
                                                size="sm"
                                                variant="flat"
                                                symbol=""
                                                className="
                                                    min-h-5
                                                    bg-default-100
                                                    px-1.5
                                                    py-0
                                                    text-xs
                                                    font-medium
                                                "
                                            >
                                                {contenedor.x_reference}
                                            </Snippet>
                                        </div>
                                    </div>

                                    {/* Medida */}
                                    <div className="hidden shrink-0 text-right sm:block">
                                        <span className="block text-[10px] font-semibold uppercase tracking-wide text-default-400">
                                            Medida
                                        </span>

                                        <span className="text-sm font-semibold text-default-600">
                                            {contenedor.x_medida_bel}
                                        </span>
                                    </div>
                                </div>

                                {/* Medida en móvil */}
                                <div className="mt-3 flex items-center justify-between border-t border-default-100 pt-2 sm:hidden">
                                    <span className="text-[10px] font-semibold uppercase tracking-wide text-default-400">
                                        Medida
                                    </span>

                                    <span className="text-xs font-semibold text-default-600">
                                        {contenedor.x_medida_bel}
                                    </span>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Contenedores;
