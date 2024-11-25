import React, { useEffect, useState, useContext } from "react";
import { Tabs, Tab, Card, CardBody, CardHeader } from "@nextui-org/react";
import { ViajeContext } from "../context/viajeContext";
import { CircularProgress } from "@nextui-org/progress";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/avatar";
import RevisionesChecklist from "./revisiones";

export default function ChecklistDetalle() {
    const { id_viaje, estatusHistorial, getHistorialEstatus } = useContext(ViajeContext);
    const [selected, setSelected] = React.useState("photos");
    const [equipos, setEquipos] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const getEstatus = async () => {

        try {
            setLoading(true);
            const response = await fetch('/phicargo/viajes/checklist/equipos/getEquipos.php', {
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
                                    src={`/phicargo/img/status/${step.imagen}`}
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
