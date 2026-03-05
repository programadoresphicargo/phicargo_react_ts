import { Steps } from 'antd';
import React, { useState, useEffect } from 'react';
import { useSolicitudesLlantas } from './contexto';

const EstadoSolicitud = () => {

    const { data } = useSolicitudesLlantas();

    const [current, setCurrent] = useState('');

    const onChange = (value) => {
        setCurrent(value);
    };

    useEffect(() => {
        onChange(data?.x_studio_status);
    }, [data?.x_studio_status]);

    return (
        <>
            <Steps
                size="small"
                style={{ fontFamily: 'Inter' }}
                type="navigation"
                current={current}
                className="site-navigation-steps"
                items={[
                    {
                        status: current === 'borrador' ? 'process' : 'wait',
                        title: 'Borrador',
                        value: 'borrador',
                    },
                    {
                        status: current === 'confirmado' ? 'process' : 'wait',
                        title: 'Confirmado',
                        value: 'confirmado',
                    },
                    {
                        status: current === 'entregado' ? 'process' : 'wait',
                        title: 'Entregado',
                        value: 'entregado',
                    },
                    {
                        status: current === 'recepcionado_operador' ? 'process' : 'wait',
                        title: 'Recepcionado por operador',
                        value: 'recepcionado_operador',
                    },
                    {
                        status: current === 'devuelto' ? 'process' : 'wait',
                        title: 'Devuelto',
                        value: 'devuelto',
                    },
                ]}
            />
        </>
    );
};

export default EstadoSolicitud;