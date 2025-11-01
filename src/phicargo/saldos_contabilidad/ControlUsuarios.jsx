import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import Maniobras from "./tabla";
import Typography from '@mui/material/Typography';
import CustomNavbar from "@/pages/CustomNavbar";

export default function Saldos() {
    return (
        <div>
            <CustomNavbar></CustomNavbar>
            <Maniobras
                estado_maniobra={'activo'} />
        </div>
    );
}
