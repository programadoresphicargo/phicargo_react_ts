import { Button } from "@heroui/react";
import { useContext } from 'react';
import { ViajeContext } from "../context/viajeContext";

function crearEnlaceDistancia({ latitud, longitud, codigoPostal, sucursal }: { latitud: number; longitud: number, codigoPostal: string, sucursal: number }) {
    let codigoPostalOrigen = codigoPostal;

    if (sucursal === 1) {
        codigoPostalOrigen = '91808';
    } else if (sucursal === 9) {
        codigoPostalOrigen = '28219';
    }

    return `https://www.google.com.mx/maps/dir/${latitud},${longitud}/${codigoPostalOrigen}/`;
}

function BotonDistanciaMapa({ latitud, longitud }: { latitud: number, longitud: number }) {
    const { viaje } = useContext(ViajeContext);

    const enlace = crearEnlaceDistancia({
        latitud,
        longitud,
        codigoPostal: viaje?.x_codigo_postal ?? '',
        sucursal: viaje?.store_id ?? 0,
    });
    
    return (
        <Button
            radius="full"
            onPress={() => window.open(enlace, '_blank')}
            className='text-white'
            color="secondary"
        >
            <i className="bi bi-geo-alt"></i>
            Ver Ruta en Google Maps
        </Button>
    );
}

export default BotonDistanciaMapa;
