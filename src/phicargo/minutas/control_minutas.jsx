import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import Typography from '@mui/material/Typography';
import Minutas from "./minutas";
import { MinutasProvider } from "./context";
import CustomNavbar from "@/pages/CustomNavbar";

export default function ControlMinutas() {
    return (
        <MinutasProvider>
            <CustomNavbar></CustomNavbar>
            <Minutas />
        </MinutasProvider>
    );
}
