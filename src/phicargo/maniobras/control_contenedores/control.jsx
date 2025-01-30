import React from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import Maniobras from "./tabla";
import ManiobrasNavBar from "../Navbar";

export default function control_contenedores() {
    return (
        <div>
            <ManiobrasNavBar />
            <Maniobras
                estado_maniobra={'activa'} />
        </div>
    );
}
