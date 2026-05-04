import { Steps } from 'antd';
import { useState, useEffect } from 'react';

type EstadoSolicitudProps = {
    meta: any;
};

const EstadoSolicitud: React.FC<EstadoSolicitudProps> = ({
    meta
}) => {

    const [current, setCurrent] = useState<number>(0);

    const stepsMap: Record<string, number> = {
        borrador: 0,
        confirmado: 1,
        entregado: 2,
        recepcionado_operador: 3,
        cerrado: 4,
        cancelado: 5,
    };

    useEffect(() => {
        setCurrent(stepsMap[meta?.x_studio_status] ?? 0);
    }, [meta?.x_studio_status]);

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
                    { title: 'Recepcionado por operador' },
                    { title: 'Cerrado' },
                    { title: 'Cancelado' },
                ]}
            />
        </>
    );
};

export default EstadoSolicitud;