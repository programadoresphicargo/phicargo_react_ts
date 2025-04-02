import { Button, Link } from "@heroui/react";
import React, { useContext, useEffect, useState } from "react";

import { ViajeContext } from "../../context/viajeContext";
import axios from "axios";
import { generatePDF } from "./generatePDF";
import odooApi from '@/api/odoo-api';

const PDFGenerator = () => {
    const { id_viaje, viaje, getViaje, loading, error, setIDViaje, isLoading } = useContext(ViajeContext);
    const [data, setData] = useState([]);
    const [data_contenedores, setDataContenedores] = useState([]);

    useEffect(() => {
        odooApi.get("/tms_travel/checklist/checklist_viajes_equipos/id_viaje/" + id_viaje)
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => console.error("Error al obtener datos", error));
    }, []);

    useEffect(() => {
        odooApi.get("/tms_travel/checklist/checklist_viajes_contenedores/id_viaje/" + id_viaje)
            .then((response) => {
                setDataContenedores(response.data);
            })
            .catch((error) => console.error("Error al obtener datos", error));
    }, []);

    return (
        <div>
            <Button
                onPress={() => generatePDF(data, data_contenedores)}
                color="danger"
                showAnchorIcon
                as={Link}
                isExternal={true}>
                Checklist viaje
            </Button>
        </div>
    );
};

export default PDFGenerator;
