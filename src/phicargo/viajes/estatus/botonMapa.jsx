import React from 'react';
import { Button } from "@heroui/button";

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
