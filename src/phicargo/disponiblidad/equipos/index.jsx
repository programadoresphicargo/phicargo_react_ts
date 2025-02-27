import React, { useState, useEffect, useMemo } from 'react';
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import HistorialManiobrasVehiculo from './historial_maniobras';
import HistorialViajesVehiculo from './historial_viajes';

const IndexHistorial = ({ vehicle_id }) => {

    return (<>
        <Tabs aria-label="Options" color="primary">
            <Tab key="viajes" title="Viajes" disabled={true}>
                <Card>
                    <CardBody>
                        <HistorialViajesVehiculo vehicle_id={vehicle_id}></HistorialViajesVehiculo>
                    </CardBody>
                </Card>
            </Tab>
            <Tab key="maniobras" title="Maniobras">
                <Card>
                    <CardBody>
                        <HistorialManiobrasVehiculo vehicle_id={vehicle_id}></HistorialManiobrasVehiculo>
                    </CardBody>
                </Card>
            </Tab>
        </Tabs>
    </>
    );
};

export default IndexHistorial;
