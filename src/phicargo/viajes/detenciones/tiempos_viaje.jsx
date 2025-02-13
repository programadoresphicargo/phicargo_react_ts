import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Progress, Card, CardHeader, Divider, CardBody } from "@nextui-org/react";
import { ViajeContext } from '../context/viajeContext';
import odooApi from '@/phicargo/modules/core/api/odoo-api';
import { TiemposViajeProvider, useTiemposViaje } from './TiemposViajeContext';

function TiemposViajes() {

    const { data, setData } = useTiemposViaje();

    return (
        <>
            <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                <Card>
                    <CardHeader className='bg-primary text-white'>
                        <i class="bi bi-clock  mr-2"></i> Fecha inicio
                    </CardHeader>
                    <Divider></Divider>
                    <CardBody>
                        <h1>{data.fecha_inicio}</h1>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className='bg-primary text-white'>
                        <i class="bi bi-clock  mr-2"></i>
                        Llegada a planta
                    </CardHeader>
                    <Divider></Divider>
                    <CardBody>
                        <h1>{data.llegada_planta}</h1>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className='bg-primary text-white'>
                        <i class="bi bi-clock  mr-2"></i> Salida de planta
                    </CardHeader>
                    <Divider></Divider>
                    <CardBody>
                        <h1>{data.salida_planta}</h1>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className='bg-primary text-white'>
                        <i class="bi bi-clock mr-2"></i>Fecha finalizado
                    </CardHeader>
                    <Divider></Divider>
                    <CardBody>
                        <h1>{data.fecha_finalizado}</h1>
                    </CardBody>
                </Card>
            </div>
        </>
    )
}

export default TiemposViajes;
