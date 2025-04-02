import { useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Spinner } from "@heroui/react";
import odooApi from "@/phicargo/modules/core/api/odoo-api";
import { User } from "@heroui/react";
import { Avatar, AvatarGroup, AvatarIcon } from "@heroui/avatar";

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
                    <>
                        <div className="flex items-center gap-3">
                            <Avatar
                                size="sm"
                                isBordered
                                color={data.tipo_registrante === "operador" ? "success" : "primary"}
                            />
                            <div>
                                <p className="font-semibold">{`${data.ultimo_estatus_enviado}`}</p>
                                <span className="text-sm text-gray-500">{data.ultimo_estatus_fecha}</span>
                            </div>
                        </div>
                    </>
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
