import React from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import Maniobras from "./tabla";
import ResponsiveAppBar from "./Navbar";
import Typography from '@mui/material/Typography';
import NavbarViajes from "../viajes/viajes/navbar";

export default function ControlEstatusOperativos() {
    return (
        <div>
            <NavbarViajes></NavbarViajes>
            <Maniobras
                estado_maniobra={'activo'} />
        </div>
    );
}
