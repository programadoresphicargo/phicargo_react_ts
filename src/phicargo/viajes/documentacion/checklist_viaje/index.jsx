import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Button, Link } from "@heroui/react";
import { generatePDF } from "./generatePDF";
import odooApi from "@/phicargo/modules/core/api/odoo-api";
import { ViajeContext } from "../../context/viajeContext";

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
