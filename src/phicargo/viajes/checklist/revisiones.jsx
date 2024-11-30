import React, { useEffect, useState, useContext, useMemo } from "react";
import { Tabs, Tab, Card, CardBody, CardHeader } from "@nextui-org/react";
import { ViajeContext } from "../context/viajeContext";
import { CircularProgress } from "@nextui-org/progress";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/avatar";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
const { VITE_PHIDES_API_URL } = import.meta.env;

export default function RevisionesChecklist() {
    const { id_viaje } = useContext(ViajeContext);
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const getEstatus = async () => {

        try {
            setLoading(true);
            const response = await fetch(VITE_PHIDES_API_URL + '/viajes/checklist/equipos/getRevisiones.php', {
                method: 'POST',
                body: new URLSearchParams({
                    id_checklist: id_viaje,
                }),
            })
            const jsonData = await response.json();
            setData(jsonData);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error al obtener los datos:', error);
        }
    };

    useEffect(() => {
        getEstatus();
    }, []);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'nombre_elemento',
                header: 'Aspecto revisado',
            },
            {
                accessorKey: 'estado',
                header: 'Estado',
                Cell: ({ cell }) => {
                    const estado = cell.getValue();
                    return estado ? (
                        <i className="bi bi-check2" style={{ color: 'green' }}></i>
                    ) : (
                        <i className="bi bi-x-circle" style={{ color: 'red' }}></i>
                    );
                },
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data,
        enableGrouping: true,
        enableGlobalFilter: true,
        enableFilters: true,
        state: { isLoading: isLoading },
        enableColumnPinning: true,
        enableStickyHeader: true,
        columnResizeMode: "onEnd",
        initialState: {
            density: 'compact',
            pagination: { pageSize: 80 },
        },
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '0',
            },
        },
        muiTableHeadCellProps: {
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'Bold',
                fontSize: '14px',
            },
        },
        muiTableBodyCellProps: {
            sx: {
                fontFamily: 'Inter',
                fontWeight: 'normal',
                fontSize: '14px',
            },
        },
        muiTableContainerProps: {
            sx: {
                borderRadius: '8px',
                overflow: 'hidden',
            },
        },
    });

    return (
        <>
            {isLoading && (
                <div style={{ marginTop: '20px' }} className="d-flex justify-content-center">
                    <CircularProgress size="lg" aria-label="Loading..." />
                </div>
            )}

            {!isLoading && (
                <MaterialReactTable table={table} />
            )}
        </>
    );
}
