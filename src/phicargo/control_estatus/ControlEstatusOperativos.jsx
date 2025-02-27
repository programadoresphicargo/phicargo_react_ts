import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import Maniobras from "./tabla";
import Typography from '@mui/material/Typography';
import NavbarViajes from "../viajes/navbar";
import { ViajeProvider } from "../viajes/context/viajeContext";

export default function ControlEstatusOperativos() {
    return (
        <div>
            <ViajeProvider>
                <NavbarViajes></NavbarViajes>
                <Maniobras
                    estado_maniobra={'activo'} />
            </ViajeProvider>
        </div>
    );
}
