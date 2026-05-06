import { useContext } from 'react';
import SolicitudesLlantas from '@/phicargo/llantas/solicitudes';
import { SolicitudesLlantasProvider } from '@/phicargo/llantas/contexto';
import { ViajeContext } from '../context/viajeContext';

const SolicitudesLlantasViajesIndex = () => {

    const { id_viaje } = useContext(ViajeContext);

    return (
        <>
            <SolicitudesLlantasProvider>
                <SolicitudesLlantas vista={'solicitudes de llantas de refacción'} travel_id={id_viaje}></SolicitudesLlantas>
            </SolicitudesLlantasProvider>
        </>
    );
};

export default SolicitudesLlantasViajesIndex;
