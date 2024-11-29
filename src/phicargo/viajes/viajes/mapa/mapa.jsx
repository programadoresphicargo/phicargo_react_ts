import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => (
    <MapContainer center={[21.9713317720013, -101.7129111380927]} zoom={5} style={{ height: '100vh', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[21.9713317720013, -101.7129111380927]}>
            <Popup>Un lugar interesante</Popup>
        </Marker>
    </MapContainer>
);

export default Map;
