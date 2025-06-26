import React, { useState, useContext, useEffect } from 'react';
import { Steps } from 'antd';
import { ViajeContext } from '../context/viajeContext';

const EstatusViaje = () => {

    const { viaje } = useContext(ViajeContext);

    const [current, setCurrent] = useState('');

    const onChange = (value) => {
        console.log('onChange:', value);
        setCurrent(value);
    };

    useEffect(() => {
        onChange(viaje?.x_status_viaje);
    }, [viaje?.x_status_viaje]);

    return (
        <>
            <Steps
                size="small"
                style={{ fontFamily: 'Inter' }}
                type="navigation"
                current={current}
                onChange={onChange}
                className="site-navigation-steps"
                items={[
                    {
                        status: current === 'disponible' ? 'process' : 'wait',
                        title: 'Disponible',
                        value: 'disponible',
                    },
                    {
                        status: current === 'ruta' ? 'process' : 'wait',
                        title: 'En ruta',
                        value: 'ruta',
                    },
                    {
                        status: current === 'planta' ? 'process' : 'wait',
                        title: 'En planta',
                        value: 'planta',
                    },
                    {
                        status: current === 'retorno' ? 'process' : 'wait',
                        title: 'En retorno',
                        value: 'retorno',
                    },
                    {
                        status: current === 'finalizado' ? 'process' : 'wait',
                        title: 'Finalizado',
                        value: 'finalizado',
                    },
                ]}
            />
        </>
    );
};

export default EstatusViaje;
