import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { ViajeProvider } from "../viajes/context/viajeContext";
import RegistrosEstadias from "./registros";
import { CostosExtrasProvider } from "../costos/context/context";
import NavbarViajes from "../viajes/navbar";

export default function EstadiasIndex() {
    return (
        <>
            <ViajeProvider>
                <NavbarViajes></NavbarViajes>
                <RegistrosEstadias></RegistrosEstadias>
            </ViajeProvider>
        </>
    );
}
