import { Button } from "@heroui/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ViajeContext } from "../context/viajeContext";

function crearEnlaceDistancia(latitud, longitud, tipo, codigoPostal, sucursal) {
    let codigoPostalOrigen = codigoPostal;

    if (sucursal === 1) {
        codigoPostalOrigen = '91808';
    } else if (sucursal === 9) {
        codigoPostalOrigen = '28219';
    }

    return `https://www.google.com.mx/maps/dir/${latitud},${longitud}/${codigoPostalOrigen}/`;
}

function BotonDistanciaMapa({ latitud, longitud, tipo }) {
    const { id_viaje, viaje } = useContext(ViajeContext);

    const enlace = crearEnlaceDistancia(latitud, longitud, tipo, viaje?.x_codigo_postal, viaje?.store_id);

    return (
        <Button
            radius="full"
            onPress={() => window.open(enlace, '_blank')}
            className='text-white'
            color="secondary"
        >
            <i class="bi bi-geo-alt"></i>
            Ver Ruta en Google Maps
        </Button>
    );
}

export default BotonDistanciaMapa;
