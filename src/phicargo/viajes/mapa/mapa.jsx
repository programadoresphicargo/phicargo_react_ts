import 'leaflet/dist/leaflet.css';

import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import { ViajeContext } from '../context/viajeContext';
import axios from 'axios';
import odooApi from '@/api/odoo-api';
import { Progress } from '@heroui/react';

const customIcon = new L.Icon({
    iconUrl: 'https://static.vecteezy.com/system/resources/previews/017/178/337/original/location-map-marker-icon-symbol-on-transparent-background-free-png.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const lastPositionIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2554/2554978.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const Map = () => {
    const { id_viaje } = useContext(ViajeContext);
    const [estatusHistorial, setHistorial] = useState([]);
    const [estatus, setEstatus] = useState([]);
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!id_viaje) return;

        setIsLoading(true);

        odooApi.get(`/tms_travel/reportes_estatus_viajes/id_viaje/${id_viaje}`)
            .then(response => {
                setEstatus(response.data);
            })
            .catch(error => {
                console.error('Error al obtener datos:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });

    }, [id_viaje]);

    useEffect(() => {
        if (!id_viaje) return;
        odooApi.get(`/tms_travel/reportes_estatus_viajes/locations_by_id_viaje/${id_viaje}`)
            .then(response => setLocations(response.data))
            .catch(error => console.error('Error al obtener datos:', error));
    }, [id_viaje]);

    const positions = useMemo(() =>
        locations?.length ? locations.map(location => [location.latitude, location.longitude]) : [],
        [locations]
    );

    return (<>
        {isLoading && (
            < Progress isIndeterminate size='sm'></Progress >
        )}
        <MapContainer center={[21.9713317720013, -101.7129111380927]} zoom={5} style={{ height: '76vh', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {estatus?.map((registro, index) => (
                <Marker key={index} position={[registro.latitud, registro.longitud]} icon={customIcon}>
                    <Popup>{registro.nombre_estatus} / {registro.fecha_envio}</Popup>
                </Marker>
            ))}
            <Polyline positions={positions} color="blue" />
            {positions.length > 0 && (
                <Marker position={positions[positions.length - 1]} icon={lastPositionIcon}>
                    <Popup>Última posición registrada</Popup>
                </Marker>
            )}
        </MapContainer>
    </>
    );
};

export default Map;
