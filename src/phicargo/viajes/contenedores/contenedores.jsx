import React, { useState, useEffect, useMemo, useContext } from 'react';
import { ViajeContext } from '../context/viajeContext';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import { Button } from '@nextui-org/button';
import { tiempoTranscurrido } from '../../funciones/tiempo';
import { Card, CardHeader } from '@nextui-org/react';
import { Avatar } from '@nextui-org/react';
import { Badge } from '@nextui-org/react';
import { toast } from 'react-toastify';
import odooApi from '@/phicargo/modules/core/api/odoo-api';

function Contenedores() {

    const { id_viaje } = useContext(ViajeContext);
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await odooApi.get('/tms_waybill/get_by_travel_id/' + id_viaje);
            setData(response.data);
        } catch (error) {
            toast.error('Error al obtener los contenedores:' + error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id_viaje]);

    return (
        <>
            {data.map((step, index) => {

                return (
                    <Card className="mb-2 w-full" isPressable>
                        <CardHeader className="justify-between">
                            <div className="flex gap-5">
                                <Avatar
                                    color={"primary"}
                                    isBordered
                                    radius="full"
                                    size="md"
                                    src={'https://cdn-icons-png.flaticon.com/512/6260/6260181.png'}
                                />
                                <div className="flex flex-col gap-1 items-start justify-center">
                                    <h4 className="text-small font-semibold leading-none text-default-600">{step.x_reference}</h4>
                                    <h5 className="text-small tracking-tight text-default-400">
                                        {step.x_medida_bel}
                                    </h5>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                );
            })}
        </>
    )
}

export default Contenedores;
