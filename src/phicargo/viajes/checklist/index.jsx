import React, { useEffect, useState, useContext } from "react";
import { Tabs, Tab, Card, CardBody, CardHeader } from "@heroui/react";
import { ViajeContext } from "../context/viajeContext";
import { CircularProgress } from "@heroui/progress";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Avatar, AvatarGroup, AvatarIcon } from "@heroui/avatar";
import RevisionesChecklist from "./revisiones";
const { VITE_PHIDES_API_URL } = import.meta.env;

export default function ChecklistDetalle() {
    const { id_viaje, estatusHistorial, getHistorialEstatus } = useContext(ViajeContext);
    const [selected, setSelected] = React.useState("photos");
    const [equipos, setEquipos] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const getEstatus = async () => {

        try {
            setLoading(true);
            const response = await fetch(VITE_PHIDES_API_URL + '/viajes/checklist/equipos/getEquipos.php', {
                method: 'POST',
                body: new URLSearchParams({
                    id_viaje: id_viaje,
                    tipo_checklist: 'salida'
                }),
            })
            const jsonData = await response.json();
            setEquipos(jsonData);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error al obtener los datos:', error);
        }
    };

    useEffect(() => {
        getEstatus();
    }, []);

    return (
        <>
            {isLoading && (
                <div style={{ marginTop: '20px' }} className="d-flex justify-content-center">
                    <CircularProgress size="lg" aria-label="Loading..." />
                </div>
            )}

            {!isLoading && (
                <Accordion variant="splitted">
                    {equipos.map((step, index) => (
                        <AccordionItem key={step.id_reporte}
                            aria-label={step.id_reporte}
                            title={step.name2}
                            subtitle={step.license_plate}
                            isCompact
                            isBordered
                            startContent={
                                <Avatar
                                    style={{ zIndex: 1 }}
                                    isBordered
                                    color="primary"
                                    radius="xl"
                                    src={VITE_PHIDES_API_URL + `/img/status/${step.imagen}`}
                                />
                            }
                        >
                            <RevisionesChecklist></RevisionesChecklist>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </>
    );
}
