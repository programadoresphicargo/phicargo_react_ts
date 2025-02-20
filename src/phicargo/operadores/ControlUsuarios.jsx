import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import Maniobras from "./tabla";
import ResponsiveAppBar from "./Navbar";
import Typography from '@mui/material/Typography';

export default function ControlOperadores() {
    return (
        <div>
            <ResponsiveAppBar></ResponsiveAppBar>
            <Maniobras
                estado_maniobra={'activo'} />
        </div>
    );
}
