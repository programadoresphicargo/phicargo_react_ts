import { Button } from "@heroui/react";

function BotonMapa({ latitud, longitud }: { latitud: number; longitud: number }) {
    const enlace = `https://www.google.com/maps?q=${latitud},${longitud}&hl=es-PY&gl=py&shorturl=1`;

    return (
        <Button
            radius="full"
            color='primary'
            className='text-white me-2'
            onPress={() => window.open(enlace, '_blank')}
        >
            <i className="bi bi-geo-alt"></i>
            Ver en Google Maps
        </Button>
    );
}

export default BotonMapa;
