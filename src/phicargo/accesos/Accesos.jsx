import React from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import Maniobras from "./tabla";
import ResponsiveAppBar from "./Navbar";
import Typography from '@mui/material/Typography';

export default function Accesos() {
    return (
        <div>
            <ResponsiveAppBar></ResponsiveAppBar>

            <h1 className="p-2 text-primary">Modulo de entradas y salidas a las instalaciones</h1>

            <div className="m-1">
                <Tabs aria-label="Options" color={'primary'} size="lg">
                    <Tab key="photos" title="Movimiento peatonal">
                        <Maniobras
                            estado_maniobra={'peatonal'} />
                    </Tab>
                    <Tab key="music" title="Movimiento vehicular">
                        <Maniobras
                            estado_maniobra={'vehicular'} />
                    </Tab>
                    <Tab key="videos" title="Archivados">
                        <Maniobras
                            estado_maniobra={'archivado'} />
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}
