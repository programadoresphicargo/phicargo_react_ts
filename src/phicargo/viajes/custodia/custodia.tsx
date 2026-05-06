import { Alert } from "@heroui/react";
import { useContext, useEffect, useState } from 'react';
import { ViajeContext } from '../context/viajeContext';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { Spinner } from "@heroui/spinner";

type Custodia = {
    x_custodia_bel: string;
};

function Custodia() {
    
    const { id_viaje } = useContext(ViajeContext);
    const [data, setData] = useState<Custodia[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await odooApi.get('/tms_waybill/get_by_travel_id/' + id_viaje);
            setData(response.data);
        } catch (error) {
            toast.error('Error al obtener los contenedores: ' + error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id_viaje]);

    return (
        <>
            {isLoading ? (
                <div className="flex justify-center items-center h-20">
                    <Spinner size="lg" color="primary" />
                </div>
            ) : (
                data
                    .filter((step) => step.x_custodia_bel === 'yes')
                    .map(() => (
                        <Alert
                            color="danger"
                            title="Servicio con custodia"
                            variant="solid"
                        />
                    ))
            )}
        </>
    );
}

export default Custodia;
