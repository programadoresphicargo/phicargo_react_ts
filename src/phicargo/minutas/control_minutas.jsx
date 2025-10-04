import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import Typography from '@mui/material/Typography';
import Minutas from "./minutas";
import { MinutasProvider } from "./context";
import MinutasNavbar from "./Navbar";

export default function ControlMinutas() {
    return (
        <MinutasProvider>
            <MinutasNavbar></MinutasNavbar>
            <Minutas />
        </MinutasProvider>
    );
}
