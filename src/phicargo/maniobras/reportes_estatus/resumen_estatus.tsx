import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner } from "@heroui/react";
import { User } from "@heroui/react";

import odooApi from '@/api/odoo-api';
import { useState } from "react";

type Estatus = {
    nombre_estatus: string;
    fecha_hora: string;
}

type Props = {
    id_maniobra: number,
    ultimo_estatus: string,
    usuario_ultimo_estatus: string;
    fecha_ultimo_estatus: string;
}

const EstatusDropdownManiobra = ({ id_maniobra, ultimo_estatus, usuario_ultimo_estatus, fecha_ultimo_estatus }: Props) => {

    const [items, setItems] = useState<Estatus[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchItems = () => {
        if (!id_maniobra) return;
        setIsLoading(true);
        odooApi.get<Estatus[]>(`/maniobras/reportes_estatus_maniobras/id_maniobra/${id_maniobra}`)
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

    const handleOpen = (open: boolean) => {
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
                            size: 'sm',
                            color: 'primary',
                            isBordered: true,
                        }}
                        description={`${usuario_ultimo_estatus} - ${fecha_ultimo_estatus}`}
                        name={`${ultimo_estatus}`}
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
                            {item.nombre_estatus}
                        </DropdownItem>
                    )}
                </DropdownMenu>
            )}
        </Dropdown>
    );
};

export default EstatusDropdownManiobra;
