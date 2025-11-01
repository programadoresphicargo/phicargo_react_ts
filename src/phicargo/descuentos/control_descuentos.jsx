import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import Typography from '@mui/material/Typography';
import { DescuentosProvider } from "./context";
import MinutasNavbar from "./Navbar";
import Descuentos from "./descuentos";
import CustomNavbar from "@/pages/CustomNavbar";

export default function ControlDescuentos() {

    const pages = [
        { name: 'DESCUENTOS', path: '/descuentos' },
    ];

    return (
        <DescuentosProvider>
            <CustomNavbar pages={pages}></CustomNavbar>
            <Descuentos></Descuentos>
        </DescuentosProvider>
    );
}
