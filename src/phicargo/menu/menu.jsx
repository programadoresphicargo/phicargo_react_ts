import React from "react";
import { Grid } from "@mui/material";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import MenuItem from "./menuitem";

const menuItems = [
    { title: "Turnos", url: '/phicargo/img/turnos.png' },
    { title: "Gestion de viaje", url: '/phicargo/img/volante.png' },
    { title: "Maniobras", url: '/phicargo/img/c1.png' },
    { title: "Monitoreo", url: '/phicargo/img/monitor.png' },
    { title: "Operadores", url: '/phicargo/img/status/start.png' },
    { title: "Bonos", url: '/phicargo/img/money.png' },
    { title: "Accesos", url: '/phicargo/img/segurity.png' },
    { title: "Reportes", url: '/phicargo/img/seguimiento.png' },
    { title: "Usuarios", url: '/phicargo/img/usuarios.png' },
    { title: "Ajustes", url: '/phicargo/img/settings.png' },
];

const Menu = () => {
    return (
        <div className="menu-container">
            {menuItems.map((item, index) => (
                <MenuItem key={index} title={item.title} icon={item.icon} />
            ))}
        </div>
    );
};

export default Menu;
