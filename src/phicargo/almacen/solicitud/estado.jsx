import { Steps } from 'antd';
import React, { useState, useEffect } from 'react';
import { useAlmacen } from '../contexto/contexto';

const EstadoSolicitud = () => {

    const { data } = useAlmacen();

    const [current, setCurrent] = useState('');

    const onChange = (value) => {
        console.log('onChange:', value);
        setCurrent(value);
    };

    useEffect(() => {
        onChange(data?.x_studio_estado);
    }, [data?.x_studio_estado]);

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