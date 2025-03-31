import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import odooApi from '@/phicargo/modules/core/api/odoo-api';
import { ViajeContext } from '../context/viajeContext';

const customIcon = new L.Icon({
    iconUrl: 'https://static.vecteezy.com/system/resources/previews/017/178/337/original/location-map-marker-icon-symbol-on-transparent-background-free-png.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const lastPositionIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Icono distinto para la última coordenada
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const Map = () => {
    const { id_viaje } = useContext(ViajeContext);
    const [estatusHistorial, setHistorial] = useState([]);
    const [estatus, setEstatus] = useState([]);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        if (!id_viaje) return;
        odooApi.get(`/reportes_estatus_viajes/id_viaje/${id_viaje}`)
            .then(response => setEstatus(response.data))
            .catch(error => console.error('Error al obtener datos:', error));
    }, [id_viaje]);

    useEffect(() => {
        if (!id_viaje) return;
        odooApi.get(`/reportes_estatus_viajes/locations_by_id_viaje/${id_viaje}`)
            .then(response => setLocations(response.data))
            .catch(error => console.error('Error al obtener datos:', error));
    }, [id_viaje]);

    const positions = useMemo(() =>
        locations?.length ? locations.map(location => [location.latitude, location.longitude]) : [],
        [locations]
    );

    return (
        <MapContainer center={[21.9713317720013, -101.7129111380927]} zoom={5} style={{ height: '100vh', width: '100%' }}>
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
    );
};

export default Map;
