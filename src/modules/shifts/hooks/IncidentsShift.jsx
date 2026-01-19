import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner } from "@heroui/react";

import { User } from "@heroui/react";
import odooApi from '@/api/odoo-api';
import { useState } from "react";

const IncidentsShift = ({ data }) => {
    const [items, setItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchItems = () => {
        setIsLoading(true);
        odooApi.get(`/drivers/${data.driver.id}/incidents?recent_only=true`)
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
                ) : data?.has_recent_incident ? (
                    <Button color="danger" size="sm" radius="full">
                        ⚠️ Con incidencias
                    </Button>
                ) : (
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            color: 'green',
                            fontWeight: 900,
                        }}
                    >
                        ✅ Sin incidencias
                    </span>
                )}
            </DropdownTrigger>
            {isLoading ? (
                <div className="flex justify-center p-2">
                    <Spinner color="danger" label="Loading..." />
                </div>
            ) : (
                <DropdownMenu aria-label="Dynamic Actions" items={items} className="max-h-[400px] overflow-auto">
                    {(item) => (
                        <DropdownItem key={item.id_viaje}>
                            <div className="flex flex-col gap-1">
                                <span className="font-semibold text-danger">{item.incidence}</span>
                                <span className="text-sm text-gray-600 flex items-start gap-1 whitespace-pre-wrap break-words max-w-xs">
                                    💬Comentarios: {item.comments}
                                </span>
                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                    ⏰ Fecha de incidencia: {item.incident_date}
                                </span>
                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                    👤Registrado por: {item.user.usuario}
                                </span>
                            </div>
                        </DropdownItem>
                    )}
                </DropdownMenu>
            )}
        </Dropdown>
    );
};

export default IncidentsShift;
