import odooApi from "@/api/odoo-api";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { ControllerFieldState } from "react-hook-form";

type OptionFlota = {
    key: number;
    label: string;
    x_tipo_carga: string;
    x_modalidad: string;
};

type Props = {
    options: OptionFlota[];
    label: string;
    id: string;
    name: string;
    value?: number;
    disabled?: boolean;
    isLoading?: boolean;
    error_operador?: string;
    onChange: (val: number | null) => void;
    filtroActivo?: boolean;
    modalidad?: string;
    tipoCarga?: string;
    fieldState?: ControllerFieldState;
};

const SelectFlota: React.FC<Props> = ({
    label,
    id,
    name,
    onChange,
    value,
    disabled = false,
    isLoading = false,
    options = [],
    filtroActivo = false,
    modalidad = null,
    tipoCarga = null,
    fieldState
}) => {

    const [filteredOptions, setFilteredOptions] = useState<OptionFlota[]>([]);
    const [isMaintenance, setIsMaintenance] = useState<boolean>(false);

    useEffect(() => {
        if (!filtroActivo) {
            setFilteredOptions(options);
            return;
        }

        if (!modalidad || !tipoCarga) {
            setFilteredOptions(options);
            return;
        }

        const filtrados = options.filter((item) => {
            const tipoOk = item.x_tipo_carga === tipoCarga;
            const modalidadOk = item.x_modalidad === modalidad;
            return tipoOk && modalidadOk;
        });

        setFilteredOptions(filtrados);
    }, [filtroActivo, options, modalidad, tipoCarga]);

    const getMaintenanceRecord = async (id: number) => {
        try {
            const response = await odooApi.get(`/maintenance-record/vehicle_id/${id}?statuses=draft&statuses=pending`);
            if (response.data != null && response.data.length != 0) {
                setIsMaintenance(true);
            }
        } catch (error) {
            setIsMaintenance(false);
        }
    };

    return (
        <>
            <Autocomplete
                label={label}
                isLoading={isLoading}
                id={id}
                name={name}
                isReadOnly={disabled}
                defaultItems={filteredOptions}
                variant={disabled ? 'flat' : 'bordered'}
                selectedKey={value ? String(value) : null}
                isInvalid={fieldState?.invalid ?? false}
                errorMessage={fieldState?.error?.message}
                onSelectionChange={(key) => {
                    const vehicleId = key ? Number(key) : null;

                    onChange(vehicleId);

                    if (vehicleId) {
                        getMaintenanceRecord(vehicleId);
                    } else {
                        setIsMaintenance(false);
                    }
                }}
            >
                {(item) => (
                    <AutocompleteItem key={item.key}>
                        {item.label}
                    </AutocompleteItem>
                )}
            </Autocomplete>

            {isMaintenance && (
                <motion.div
                    initial={{
                        opacity: 0,
                        height: 0,
                        y: -8,
                    }}
                    animate={{
                        opacity: 1,
                        height: 'auto',
                        y: 0,
                    }}
                    exit={{
                        opacity: 0,
                        height: 0,
                        y: -8,
                    }}
                    transition={{
                        duration: 0.3,
                        ease: 'easeOut',
                    }}
                    className="overflow-hidden"
                >
                    <div
                        className="mt-2 flex items-center gap-3 rounded-xl bg-[#C40C0C] px-4 py-3 text-white shadow-sm"
                        style={{
                            fontFamily: 'Inter, sans-serif',
                        }}
                    >
                        {/* Icono animado */}
                        <motion.div
                            initial={{
                                scale: 0.7,
                                rotate: -10,
                            }}
                            animate={{
                                scale: 1,
                                rotate: 0,
                            }}
                            transition={{
                                duration: 0.35,
                                delay: 0.1,
                                type: 'spring',
                                stiffness: 300,
                                damping: 15,
                            }}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15"
                        >
                            <motion.i
                                animate={{
                                    scale: [1, 1.5, 1],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                className="bi bi-tools text-base text-white"
                            />
                        </motion.div>

                        {/* Contenido */}
                        <div className="min-w-0">
                            <p className="text-xs font-bold">
                                Precaución
                            </p>

                            <p className="mt-0.5 text-xs leading-5 text-red-50">
                                Equipo con reporte de mantenimiento pendiente
                                de atención.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </>
    );
};

export default SelectFlota;
