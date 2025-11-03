import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import Maniobras from "./tabla";
import Typography from '@mui/material/Typography';
import { ViajeProvider } from "../viajes/context/viajeContext";
import NavbarTravel from "../viajes/navbar_viajes";

export default function ControlEstatusOperativos() {
    return (
        <div>
            <ViajeProvider>
                <NavbarTravel></NavbarTravel>
                <Maniobras
                    estado_maniobra={'activo'} />
            </ViajeProvider>
        </div>
    );
}
