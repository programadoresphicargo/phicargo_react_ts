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

const Map = () => {
    const { id_viaje } = useContext(ViajeContext);
    const [estatusHistorial, setHistorial] = useState([]);
    const [isLoading, setLoading] = useState([]);
    const [estatus, setEstatus] = useState([]);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        odooApi.get(`/reportes_estatus_viajes/id_viaje/${id_viaje}`)
            .then(response => {
                setEstatus(response.data);
            })
            .catch(error => {
                console.error('Error al obtener datos:', error);
            });
    }, []);

    useEffect(() => {
        odooApi.get(`/reportes_estatus_viajes/locations_by_id_viaje/${id_viaje}`)
            .then(response => {
                setLocations(response.data);
            })
            .catch(error => {
                console.error('Error al obtener datos:', error);
            });
    }, []);

    const positions = locations.map(location => [location.latitude, location.longitude]);

    return (
        <MapContainer center={[21.9713317720013, -101.7129111380927]} zoom={5} style={{ height: '100vh', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {estatus.map((status, index) => (
                <Marker key={index} position={[status.latitud, status.longitud]} icon={customIcon}>
                    <Popup>{status.nombre_estatus}</Popup>
                </Marker>
            ))}
            <Polyline positions={positions} color="blue" />
        </MapContainer>
    );
};

export default Map;
