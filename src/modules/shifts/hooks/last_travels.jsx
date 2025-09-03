import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner } from "@heroui/react";

import { User } from "@heroui/react";
import odooApi from '@/api/odoo-api';
import { useState } from "react";

const LastTravels = ({ data }) => {
    const [items, setItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchItems = () => {
        setIsLoading(true);
        odooApi.get(`/tms_travel/last_travels/${data.driver.id}/15`)
            .then((response) => {
                setItems(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener los items:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleOpen = (open) => {
        setIsOpen(open);
        if (open) fetchItems();
    };

    return (
        <Dropdown isOpen={isOpen} onOpenChange={handleOpen} backdrop="opaque">
            <DropdownTrigger>
                {isLoading ? (
                    <Spinner size="sm" />
                ) : (
                    <Button color="primary" size="sm">
                        {data.travel?.routeName}
                    </Button>
                )}
            </DropdownTrigger>
            {isLoading ? (
                <div className="flex justify-center p-2">
                    <Spinner color="warning" label="Loading..." />
                </div>
            ) : (
                <DropdownMenu aria-label="Dynamic Actions" items={items} className="max-h-[400px] overflow-auto">
                    {(item) => (
                        <DropdownItem key={item.id_viaje}>
                            <div className="flex flex-col gap-1">
                                <span className="font-semibold text-primary">{item.referencia}</span>
                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                    🛣️            {item.ruta}
                                </span>
                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                    📅     Inicio: {item.fecha_inicio}
                                </span>
                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                    ⏰ Duración: {item.diferencia_dias > 0 ? item.diferencia_dias + ' días ' : ''}{item.diferencia_horas_minutos}
                                </span>
                            </div>
                        </DropdownItem>
                    )}
                </DropdownMenu>
            )}
        </Dropdown>
    );
};

export default LastTravels;
