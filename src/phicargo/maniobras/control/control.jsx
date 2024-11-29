import React from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import Maniobras from "./tabla";
import ManiobrasNavBar from "../Navbar";

export default function control_maniobras() {
    return (
        <div>
            <ManiobrasNavBar />
            <div className="m-1">
                <Tabs aria-label="Options" color={'primary'} size="lg">
                    <Tab key="photos" title="Activas">
                        <Maniobras
                            estado_maniobra={'activa'} />
                    </Tab>
                    <Tab key="music" title="Programadas">
                        <Maniobras
                            estado_maniobra={'borrador'} />
                    </Tab>
                    <Tab key="videos" title="Finalizadas">
                        <Maniobras
                            estado_maniobra={'finalizada'} />
                    </Tab>
                    <Tab key="mp" title="Pendientes por asignar">
                        <Maniobras
                            estado_maniobra={'mp'} />
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}
