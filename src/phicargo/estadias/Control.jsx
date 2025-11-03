import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { ViajeProvider } from "../viajes/context/viajeContext";
import RegistrosEstadias from "./registros";
import { CostosExtrasProvider } from "../costos/context/context";
import NavbarTravel from "../viajes/navbar_viajes";

export default function EstadiasIndex() {
    return (
        <>
            <ViajeProvider>
                <NavbarTravel></NavbarTravel>
                <RegistrosEstadias></RegistrosEstadias>
            </ViajeProvider>
        </>
    );
}
