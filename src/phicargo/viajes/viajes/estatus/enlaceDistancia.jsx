import React from 'react';
import { Button } from '@nextui-org/button';

function crearEnlaceDistancia(latitud, longitud, tipo, codigoPostal, sucursal) {
    let codigoPostalOrigen = codigoPostal;

    if (tipo === 'imp') {
        if (sucursal === '[VER] Veracruz (Matriz)') {
            codigoPostalOrigen = '91808';
        } else if (sucursal === '[MZN] Manzanillo (Sucursal)') {
            codigoPostalOrigen = '28219';
        }
    }

    return `https://www.google.com.mx/maps/dir/${latitud},${longitud}/${codigoPostalOrigen}/`;
}

function BotonDistanciaMapa({ latitud, longitud, tipo, codigoPostal, sucursal }) {
    const enlace = crearEnlaceDistancia(latitud, longitud, tipo, codigoPostal, sucursal);

    return (
        <Button
            onClick={() => window.open(enlace, '_blank')}
            className='text-white'
        >
            <i class="bi bi-geo-alt"></i>
            Ver Ruta en Google Maps
        </Button>
    );
}

export default BotonDistanciaMapa;
