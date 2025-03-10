import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import ResponsiveAppBar from "./Navbar";
import { ViajeProvider } from "../viajes/context/viajeContext";
import RegistrosEstadias from "./registros";
import { CostosExtrasProvider } from "../costos/context/context";
import EstadiasForm from "./estadia_form";
import NavbarViajes from "../viajes/navbar";

export default function EstadiaViajeIndex() {
    return (
        <ViajeProvider>
            <CostosExtrasProvider>
                <NavbarViajes></NavbarViajes>
                <EstadiasForm></EstadiasForm>
            </CostosExtrasProvider>
        </ViajeProvider>
    );
}
