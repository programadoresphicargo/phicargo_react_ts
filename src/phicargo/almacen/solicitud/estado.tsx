import { Steps } from 'antd';
import { useState, useEffect } from 'react';
import { useAlmacen } from '../contexto/contexto';

const EstadoSolicitud = () => {

    const { data } = useAlmacen();
    const [current, setCurrent] = useState<number>(0);

    const stepsMap: Record<string, number> = {
        borrador: 0,
        confirmado: 1,
        entregado: 2,
        recepcionado_operador: 3,
        devuelto: 4
    };

    useEffect(() => {
        setCurrent(stepsMap[data?.x_studio_estado] ?? 0);
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
                    { title: 'Borrador' },
                    { title: 'Confirmado' },
                    { title: 'Entregado' },
                    { title: 'Recepcionado operador' },
                    { title: 'Devuelto' }
                ]}
            />
        </>
    );
};

export default EstadoSolicitud;