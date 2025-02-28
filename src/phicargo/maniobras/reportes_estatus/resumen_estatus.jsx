import { useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Spinner } from "@heroui/react";
import odooApi from "@/phicargo/modules/core/api/odoo-api";
import { User, Link } from "@heroui/react";

const EstatusDropdownManiobra = ({ id_maniobra, ultimo_estatus }) => {
    const [items, setItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchItems = () => {
        setIsLoading(true);
        odooApi.get(`/estatus_maniobras/estatus_by_id_maniobra/${id_maniobra}`)
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
                            src: "https://th.bing.com/th/id/OIP.9_MptOLxjJEGSGukPt9FWQHaHa?w=1920&h=1920&rs=1&pid=ImgDetMain",
                        }}
                        description={ultimo_estatus}
                        name={ultimo_estatus}
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
                            description={item.fecha_hora}>
                            {item.nombre_estatus} / {item.nombre}
                        </DropdownItem>
                    )}
                </DropdownMenu>
            )}
        </Dropdown>
    );
};

export default EstatusDropdownManiobra;
