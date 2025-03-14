import { Button } from "@heroui/react";
import React from 'react';

function BotonMapa({ latitud, longitud }) {
    const enlace = `https://www.google.com/maps?q=${latitud},${longitud}&hl=es-PY&gl=py&shorturl=1`;

    return (
        <Button
            color='primary'
            className='text-white me-2'
            onClick={() => window.open(enlace, '_blank')}
        >
            <i class="bi bi-geo-alt"></i>
            Ver en Google Maps
        </Button>
    );
}

export default BotonMapa;
