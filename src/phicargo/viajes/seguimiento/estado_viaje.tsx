import { useContext } from 'react';
import { Steps } from 'antd';
import { ViajeContext } from '../context/viajeContext';

export const EstatusViaje = () => {
    const { viaje } = useContext(ViajeContext);

    const stepsMap: Record<string, number> = {
        disponible: 0,
        ruta: 1,
        planta: 2,
        retorno: 3,
        finalizado: 4,
        resguardo: 5,
    };

    const current = stepsMap[viaje?.x_status_viaje] ?? 0;

    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <Steps
                size="small"
                current={current}
                responsive
                items={[
                    {
                        title: 'Disponible',
                        icon: <i className="bi bi-check-circle" />,
                    },
                    {
                        title: 'Ruta',
                        icon: <i className="bi bi-truck" />,
                    },
                    {
                        title: 'Planta',
                        icon: <i className="bi bi-building" />,
                    },
                    {
                        title: 'Retorno',
                        icon: <i className="bi bi-arrow-return-left" />,
                    },
                    {
                        title: 'Finalizado',
                        icon: <i className="bi bi-flag-fill" />,
                    },
                    {
                        title: 'Resguardo',
                        icon: <i className="bi bi-shield-check" />,
                    },
                ]}
            />
        </div>
    );
};