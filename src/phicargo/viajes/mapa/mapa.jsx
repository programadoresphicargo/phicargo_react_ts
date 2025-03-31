import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import odooApi from '@/phicargo/modules/core/api/odoo-api';
import { ViajeContext } from '../context/viajeContext';

const Map = () => {
    const { id_viaje } = useContext(ViajeContext);
    const [estatusHistorial, setHistorial] = useState([]);
    const [isLoading, setLoading] = useState([]);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        odooApi.get(`/reportes_estatus_viajes/id_viaje/${id_viaje}`)
            .then(response => {
                setLocations(response.data);
            })
            .catch(error => {
                console.error('Error al obtener datos:', error);
            });
    }, []);

    const positions = locations.map(location => [location.latitud, location.longitud]);

    return (
        <MapContainer center={[21.9713317720013, -101.7129111380927]} zoom={5} style={{ height: '100vh', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {locations.map((location, index) => (
                <Marker key={index} position={[location.latitud, location.longitud]}>
                    <Popup>{location.nombre_estatus}</Popup>
                </Marker>
            ))}
            <Polyline positions={positions} color="blue" />
        </MapContainer>
    );
};

export default Map;
