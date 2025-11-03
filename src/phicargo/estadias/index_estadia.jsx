import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { ViajeProvider } from "../viajes/context/viajeContext";
import RegistrosEstadias from "./registros";
import { CostosExtrasProvider } from "../costos/context/context";
import EstadiasForm from "./estadia_form";
import NavbarTravel from "../viajes/navbar_viajes";

export default function EstadiaViajeIndex() {
    return (
        <ViajeProvider>
            <h1>americn</h1>
            <CostosExtrasProvider>
                <NavbarTravel></NavbarTravel>
                <EstadiasForm></EstadiasForm>
            </CostosExtrasProvider>
        </ViajeProvider>
    );
}
