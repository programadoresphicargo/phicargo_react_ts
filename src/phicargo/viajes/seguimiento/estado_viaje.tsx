import { useState, useContext, useEffect } from 'react';
import { Steps } from 'antd';
import { ViajeContext } from '../context/viajeContext';

const EstatusViaje = () => {

    const { viaje } = useContext(ViajeContext);

    const [current, setCurrent] = useState<number>(0);

    const stepsMap: Record<string, number> = {
        disponible: 0,
        ruta: 1,
        planta: 2,
        retorno: 3,
        finalizado: 4,
    };

    useEffect(() => {
        setCurrent(stepsMap[viaje?.x_status_viaje] ?? 0);
    }, [viaje?.x_status_viaje]);

    return (
        <>
            <Steps
                size="small"
                style={{ fontFamily: 'Inter' }}
                type="navigation"
                current={current}
                className="site-navigation-steps"
                items={[
                    { title: 'Disponible' },
                    { title: 'Ruta' },
                    { title: 'Planta' },
                    { title: 'Retorno' },
                    { title: 'Finalizado' },
                ]}
            />
        </>
    );
};

export default EstatusViaje;
