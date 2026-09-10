import odooApi from "@/api/odoo-api";
import { Alert, Autocomplete, AutocompleteItem } from "@heroui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';

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
    tipoCarga = null
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
            const response = await odooApi.get(`/maintenance-record/vehicle_id/${id}?statuses=draft`);
            if (response.data != null) {
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
                selectedKey={String(value)}
                onSelectionChange={(key) => {
                    const vehicleId = key ? Number(key) : null;

                    onChange(vehicleId);

                    if (vehicleId) {
                        getMaintenanceRecord(vehicleId);
                    } else {
                        setIsMaintenance(false);
                    }
                }
                }
            >
                {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
            </Autocomplete >
            {isMaintenance && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    <Alert
                        color="danger"
                        variant="solid"
                        className="mt-2"
                        description="Equipo con reporte de mantenimiento pendiente de atención."
                        title="Precaución"
                    />
                </motion.div>
            )
            }
        </>
    );
};

export default SelectFlota;
