import React from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import ResponsiveAppBar from "./Navbar";
import Typography from '@mui/material/Typography';
import Turnos from "./tabla";

export default function ControlTurnos() {
    return (
        <div>
            <ResponsiveAppBar></ResponsiveAppBar>
            <Turnos
                estado_maniobra={'activo'} />
        </div>
    );
}
