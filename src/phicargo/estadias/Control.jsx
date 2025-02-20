import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import ResponsiveAppBar from "./Navbar";
import CartasPorteCE from "./cartas_porte";

export default function EstadiasIndex() {
    return (
        <div>
            <ResponsiveAppBar></ResponsiveAppBar>
            <CartasPorteCE
                estado_maniobra={'activo'}
            />
        </div>
    );
}
