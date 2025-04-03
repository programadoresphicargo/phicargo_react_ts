import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner } from "@heroui/react";

import { User } from "@heroui/react";
import odooApi from '@/api/odoo-api';
import { useState } from "react";

const EstatusDropdown = ({ data }) => {
    const [items, setItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchItems = () => {
        setIsLoading(true);
        odooApi.get(`/reportes_estatus_viajes/by_id_viaje/${data.id_viaje}`)
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
        <Dropdown isOpen={isOpen} onOpenChange={handleOpen}>
            <DropdownTrigger>
                {isLoading ? (
                    <Spinner size="sm" />
                ) : (
                    <User
                        avatarProps={{
                            className:"text-white",
                            isBordered: true,
                            color: data.tipo_registrante === "operador"
                                ? "success"
                                : data.tipo_registrante === "administrador"
                                    ? "warning"
                                    : "primary",
                        }}
                        name={`${data.ultimo_estatus_enviado}`}
                        description={`${data.nombre_registrante} ${data.ultimo_estatus_fecha}`}
                    />
                )}
            </DropdownTrigger>
            {isLoading ? (
                <div className="flex justify-center p-2">
                    <Spinner color="warning" label="Loading..." />
                </div>
            ) : (
                <DropdownMenu aria-label="Dynamic Actions" items={items} className="max-h-[400px] overflow-auto">
                    {(item) => (
                        <DropdownItem
                            key={item.nombre_estatus}
                            description={item.primera_fecha_envio}>
                            {item.nombre_estatus} / {item.name}
                        </DropdownItem>
                    )}
                </DropdownMenu>
            )}
        </Dropdown>
    );
};

export default EstatusDropdown;
