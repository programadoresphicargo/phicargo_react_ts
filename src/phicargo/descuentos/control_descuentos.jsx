import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import Typography from '@mui/material/Typography';
import { DescuentosProvider } from "./context";
import MinutasNavbar from "./Navbar";
import Descuentos from "./descuentos";

export default function ControlDescuentos() {
    return (
        <DescuentosProvider>
            <MinutasNavbar></MinutasNavbar>
            <Descuentos></Descuentos>
        </DescuentosProvider>
    );
}
