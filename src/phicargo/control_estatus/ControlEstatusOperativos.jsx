import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import Maniobras from "./tabla";
import Typography from '@mui/material/Typography';
import NavbarTravel from "../viajes/navbar_viajes";
import EstatusOperativos from "./tabla";

export default function ControlEstatusOperativos() {
    return (
        <>
            <NavbarTravel></NavbarTravel>
            <EstatusOperativos></EstatusOperativos>
        </>
    );
}
