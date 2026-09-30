import { Button, Tab, Tabs } from "@heroui/react";
import { Card, Chip, Divider } from "@heroui/react";
import { CardBody, CardHeader, Snippet } from "@heroui/react";
import React, { useContext } from "react";
import Contenedores from "../contenedores/contenedores";
import CumplimientoOperador from "../cumplimiento_operador/cumplimiento";
import EstatusHistorial from "../estatus/estatus";
import Grid from '@mui/material/Grid2';
import PanelEnvio from '../panel_envio_estatus/panel_envio';
import { ViajeContext } from "../context/viajeContext";
import { useJourneyDialogs } from "./funciones";
import Custodia from "../custodia/custodia";
import LlegadaTarde from "../llegada_tarde";
import FormEquipoViaje from "./editar_equipo";
import SeguimientoSimpleManiobra from "../estatus/maniobras/estatus_maniobras";
import SeguimientoSimpleViaje from "../estatus/simple";
import Notas from "./notas";
import { EstatusViaje } from "./estado_viaje";

export default function Seguimiento() {

    const { finalizar_viaje, liberar_resguardo, reactivar_viaje, comprobar_disponibilidad, calcular_estadia } = useJourneyDialogs();
    const { id_viaje, viaje, correosLigados, isLoading } = useContext(ViajeContext);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [openFormViaje, setOpenFormViaje] = React.useState(false);

    const handleClickOpenFormViaje = () => {
        setOpenFormViaje(true);
    };

    const handleCloseFormViaje = () => {
        setOpenFormViaje(false);
    };

    const [openNotas, setOpenNotas] = React.useState(false);

    const handleClickOpenNotas = () => {
        setOpenNotas(true);
    };

    const handleCloseNotas = () => {
        setOpenNotas(false);
    };

    return (
        <>
            <Grid container spacing={2}>

                <Custodia></Custodia>

                <Grid size={12}>
                    <Card className="border border-slate-200 bg-white shadow-sm">
                        <CardBody className="px-4 py-3">
                            <div className="flex items-center gap-5">

                                {/* Acciones */}
                                <div className="flex min-w-0 flex-1 items-center gap-2">

                                    <div className="flex flex-wrap gap-2">
                                        {viaje?.x_status_viaje == null && (
                                            <Button
                                                color="primary"
                                                onPress={comprobar_disponibilidad}
                                                isDisabled={correosLigados || isLoading}
                                                radius="md"
                                                size="sm"
                                                className="min-w-[150px] text-white"
                                            >
                                                <i className="bi bi-play-fill" />
                                                Iniciar
                                            </Button>
                                        )}

                                        {['ruta', 'planta', 'retorno'].includes(
                                            viaje?.x_status_viaje
                                        ) && (
                                                <Button
                                                    color="danger"
                                                    onPress={finalizar_viaje}
                                                    isDisabled={correosLigados || isLoading}
                                                    radius="md"
                                                    size="sm"
                                                    className="min-w-[150px] text-white"
                                                >
                                                    <i className="bi bi-stop-fill" />
                                                    Finalizar
                                                </Button>
                                            )}

                                        <Button
                                            color="success"
                                            onPress={handleClickOpen}
                                            isDisabled={correosLigados || isLoading}
                                            radius="md"
                                            size="sm"
                                            className="min-w-[150px] text-white"
                                        >
                                            <i className="bi bi-send-plus-fill" />
                                            Nuevo estatus
                                        </Button>

                                        {viaje?.x_status_viaje == 'resguardo' && (
                                            <Button
                                                color="primary"
                                                onPress={liberar_resguardo}
                                                isDisabled={correosLigados || isLoading}
                                                radius="md"
                                                size="sm"
                                                className="min-w-[150px] text-white"
                                            >
                                                <i className="bi bi-unlock-fill" />
                                                Liberar
                                            </Button>
                                        )}

                                        {viaje?.x_status_viaje == 'finalizado' && (
                                            <Button
                                                color="success"
                                                onPress={reactivar_viaje}
                                                isDisabled={correosLigados || isLoading}
                                                radius="md"
                                                size="sm"
                                                className="min-w-[150px] text-white"
                                            >
                                                <i className="bi bi-arrow-clockwise" />
                                                Reactivar
                                            </Button>
                                        )}

                                        <Button
                                            color="danger"
                                            onPress={() => calcular_estadia(id_viaje)}
                                            radius="md"
                                            size="sm"
                                            className="min-w-[150px] text-white"
                                        >
                                            <i className="bi bi-calculator" />
                                            Estadías
                                        </Button>

                                        <Button
                                            color="primary"
                                            onPress={handleClickOpenFormViaje}
                                            radius="md"
                                            size="sm"
                                            className="min-w-[150px] text-white"
                                        >
                                            <i className="bi bi-pencil" />
                                            Equipo
                                        </Button>

                                        <Button
                                            color="warning"
                                            onPress={handleClickOpenNotas}
                                            radius="md"
                                            size="sm"
                                            className="min-w-[150px] text-white"
                                        >
                                            <i className="bi bi-journal-text" />
                                            Notas
                                        </Button>
                                    </div>
                                </div>

                                {/* Separador */}
                                <div className="hidden h-10 w-px bg-slate-200 xl:block" />

                                {/* Estatus */}
                                <div className="w-[46%] min-w-[480px]">
                                    <EstatusViaje />
                                </div>

                            </div>
                        </CardBody>
                    </Card>
                </Grid>

                <Grid size={4}>

                    <LlegadaTarde></LlegadaTarde>

                    <Grid size={12}>
                        <Card
                            shadow="sm"
                            radius="lg"
                            className="w-full border border-default-200 bg-white"
                        >
                            <CardHeader className="flex items-center justify-between border-b border-default-100 px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={1.8}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M13 16h-1v-4h-1m1-4h.01M12 22a10 10 0 100-20 10 10 0 000 20z"
                                            />
                                        </svg>
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-semibold text-default-700">
                                            Información del viaje
                                        </h2>

                                        <p className="text-xs text-default-400">
                                            Datos operativos y generales
                                        </p>
                                    </div>
                                </div>

                                <Chip
                                    color="primary"
                                    size="sm"
                                    variant="flat"
                                    radius="sm"
                                    className="font-semibold"
                                >
                                    VIAJE
                                </Chip>
                            </CardHeader>

                            <CardBody className="p-5">
                                <div className="space-y-6">

                                    {/* =====================================================
                EQUIPO DE VIAJE
            ====================================================== */}
                                    <section>
                                        <div className="mb-3 flex items-center gap-2">
                                            <div className="h-4 w-1 rounded-full bg-primary" />

                                            <h3 className="text-xs font-bold uppercase tracking-wider text-default-500">
                                                Equipo de viaje
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">

                                            {/* Vehículo */}
                                            <div className="rounded-lg border border-default-100 bg-white p-3 transition-colors hover:bg-default-50">
                                                <span className="block text-[10px] font-semibold uppercase tracking-wide text-default-400">
                                                    Vehículo
                                                </span>

                                                <strong className="mt-1 block whitespace-normal break-words text-sm font-semibold text-default-700">
                                                    {viaje?.vehicle?.name || "—"}
                                                </strong>
                                            </div>

                                            {/* Remolque 1 */}
                                            <div className="rounded-lg border border-default-100 bg-white p-3 transition-colors hover:bg-default-50">
                                                <span className="block text-[10px] font-semibold uppercase tracking-wide text-default-400">
                                                    Remolque 1
                                                </span>

                                                <strong className="mt-1 block whitespace-normal break-words text-sm font-semibold text-default-700">
                                                    {viaje?.trailer1?.name || "—"}
                                                </strong>
                                            </div>

                                            {/* Remolque 2 */}
                                            <div className="rounded-lg border border-default-100 bg-white p-3 transition-colors hover:bg-default-50">
                                                <span className="block text-[10px] font-semibold uppercase tracking-wide text-default-400">
                                                    Remolque 2
                                                </span>

                                                <strong className="mt-1 block whitespace-normal break-words text-sm font-semibold text-default-700">
                                                    {viaje?.trailer2?.name || "—"}
                                                </strong>
                                            </div>

                                            {/* Dolly */}
                                            <div className="rounded-lg border border-default-100 bg-white p-3 transition-colors hover:bg-default-50">
                                                <span className="block text-[10px] font-semibold uppercase tracking-wide text-default-400">
                                                    Dolly
                                                </span>

                                                <strong className="mt-1 block whitespace-normal break-words text-sm font-semibold text-default-700">
                                                    {viaje?.dolly?.name || "—"}
                                                </strong>
                                            </div>

                                            {/* Motogenerador 1 */}
                                            <div className="rounded-lg border border-default-100 bg-white p-3 transition-colors hover:bg-default-50">
                                                <span className="block text-[10px] font-semibold uppercase tracking-wide text-default-400">
                                                    Motogenerador 1
                                                </span>

                                                <strong className="mt-1 block whitespace-normal break-words text-sm font-semibold text-default-700">
                                                    {viaje?.x_motogenerador1?.name || "—"}
                                                </strong>
                                            </div>

                                            {/* Motogenerador 2 */}
                                            <div className="rounded-lg border border-default-100 bg-white p-3 transition-colors hover:bg-default-50">
                                                <span className="block text-[10px] font-semibold uppercase tracking-wide text-default-400">
                                                    Motogenerador 2
                                                </span>

                                                <strong className="mt-1 block whitespace-normal break-words text-sm font-semibold text-default-700">
                                                    {viaje?.x_motogenerador2?.name || "—"}
                                                </strong>
                                            </div>
                                        </div>
                                    </section>

                                    {/* =====================================================
                DATOS DEL VIAJE
            ====================================================== */}
                                    <section>
                                        <div className="mb-3 flex items-center gap-2">
                                            <div className="h-4 w-1 rounded-full bg-primary" />

                                            <h3 className="text-xs font-bold uppercase tracking-wider text-default-500">
                                                Datos del viaje
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">

                                            {/* Operador */}
                                            <div className="rounded-lg border border-default-100 bg-white p-3 transition-colors hover:bg-default-50">
                                                <span className="block text-[10px] font-semibold uppercase tracking-wide text-default-400">
                                                    Operador
                                                </span>
                                                <strong className="mt-1 block whitespace-normal break-words text-xs font-semibold text-default-700">
                                                    {viaje?.employee?.name || "—"}
                                                </strong>
                                            </div>

                                            {/* Ejecutivo */}
                                            <div className="rounded-lg border border-default-100 bg-white p-3 transition-colors hover:bg-default-50">
                                                <span className="block text-[10px] font-semibold uppercase tracking-wide text-default-400">
                                                    Ejecutiv@
                                                </span>
                                                <strong className="mt-1 block whitespace-normal break-words text-xs font-semibold text-default-700">
                                                    {viaje?.x_ejecutivo_viaje_bel || "—"}
                                                </strong>
                                            </div>

                                            {/* Cliente */}
                                            <div className="rounded-lg border border-default-100 bg-white p-3 transition-colors hover:bg-default-50">
                                                <span className="block text-[10px] font-semibold uppercase tracking-wide text-default-400">
                                                    Cliente
                                                </span>
                                                <strong className="mt-1 block whitespace-normal break-words text-xs font-semibold text-default-700">
                                                    {viaje?.partner?.name || "—"}
                                                </strong>
                                            </div>

                                            {/* Inicio programado */}
                                            <div className="rounded-lg border border-default-100 bg-white p-3 transition-colors hover:bg-default-50">
                                                <span className="block text-[10px] font-semibold uppercase tracking-wide text-default-400">
                                                    Inicio programado
                                                </span>
                                                <strong className="mt-1 block whitespace-normal break-words text-xs font-semibold text-default-700">
                                                    {viaje?.inicio_programado || "—"}
                                                </strong>
                                            </div>

                                            {/* Llegada a planta */}
                                            <div className="rounded-lg border border-default-100 bg-white p-3 transition-colors hover:bg-default-50">
                                                <span className="block text-[10px] font-semibold uppercase tracking-wide text-default-400">
                                                    Llegada a planta programada
                                                </span>
                                                <strong className="mt-1 block whitespace-normal break-words text-xs font-semibold text-default-700">
                                                    {viaje?.llegada_planta_programada || "—"}
                                                </strong>
                                            </div>

                                            {/* Inicio real */}
                                            <div className="rounded-lg border border-default-100 bg-white p-3 transition-colors hover:bg-default-50">
                                                <span className="block text-[10px] font-semibold uppercase tracking-wide text-default-400">
                                                    Inicio real de viaje
                                                </span>
                                                <strong className="mt-1 block whitespace-normal break-words text-xs font-semibold text-default-700">
                                                    {viaje?.fecha_inicio || "—"}
                                                </strong>
                                            </div>

                                            {/* Finalización */}
                                            <div className="rounded-lg border border-default-100 bg-white p-3 transition-colors hover:bg-default-50">
                                                <span className="block text-[10px] font-semibold uppercase tracking-wide text-default-400">
                                                    Finalización
                                                </span>
                                                <strong className="mt-1 block whitespace-normal break-words text-xs font-semibold text-default-700">
                                                    {viaje?.fecha_finalizado || "—"}
                                                </strong>
                                            </div>

                                            {/* Modo */}
                                            <div className="rounded-lg border border-default-100 bg-white p-3 transition-colors hover:bg-default-50">
                                                <span className="block text-[10px] font-semibold uppercase tracking-wide text-default-400">
                                                    Modo
                                                </span>
                                                <strong className="mt-1 block whitespace-normal break-words text-xs font-semibold text-default-700">
                                                    {viaje?.x_modo_bel || "—"}
                                                </strong>
                                            </div>

                                            {/* Armado */}
                                            <div className="rounded-lg border border-default-100 bg-white p-3 transition-colors hover:bg-default-50">
                                                <span className="block text-[10px] font-semibold uppercase tracking-wide text-default-400">
                                                    Armado
                                                </span>
                                                <strong className="mt-1 block whitespace-normal break-words text-xs font-semibold text-default-700">
                                                    {viaje?.x_tipo_bel || "—"}
                                                </strong>
                                            </div>

                                            {/* Origen */}
                                            <div className="rounded-lg border border-default-100 bg-white p-3 transition-colors hover:bg-default-50">
                                                <span className="block text-[10px] font-semibold uppercase tracking-wide text-default-400">
                                                    Origen
                                                </span>
                                                <strong className="mt-1 block whitespace-normal break-words text-xs font-semibold text-default-700">
                                                    {viaje?.origen || "—"}
                                                </strong>
                                            </div>

                                            {/* Dirección origen */}
                                            <div className="rounded-lg border border-default-100 bg-white p-3 transition-colors hover:bg-default-50">
                                                <span className="block text-[10px] font-semibold uppercase tracking-wide text-default-400">
                                                    Dirección origen
                                                </span>
                                                <strong className="mt-1 block whitespace-normal break-words text-xs font-semibold text-default-700">
                                                    {viaje?.direccion_origen?.name || "—"}
                                                </strong>
                                            </div>

                                            {/* Dirección destino */}
                                            <div className="rounded-lg border border-default-100 bg-white p-3 transition-colors hover:bg-default-50">
                                                <span className="block text-[10px] font-semibold uppercase tracking-wide text-default-400">
                                                    Dirección destino
                                                </span>
                                                <strong className="mt-1 block whitespace-normal break-words text-xs font-semibold text-default-700">
                                                    {viaje?.direccion_destino?.name || "—"}
                                                </strong>
                                            </div>

                                            {/* Ruta */}
                                            <div className="rounded-lg border border-default-100 bg-white p-3 transition-colors hover:bg-default-50">
                                                <span className="block text-[10px] font-semibold uppercase tracking-wide text-default-400">
                                                    Ruta
                                                </span>
                                                <strong className="mt-1 block whitespace-normal break-words text-xs font-semibold text-default-700">
                                                    {viaje?.route?.name || "—"}
                                                </strong>
                                            </div>

                                            {/* Código postal */}
                                            <div className="rounded-lg border border-default-100 bg-white p-3 transition-colors hover:bg-default-50">
                                                <span className="block text-[10px] font-semibold uppercase tracking-wide text-default-400">
                                                    Código postal
                                                </span>
                                                <strong className="mt-1 block whitespace-normal break-words text-xs font-semibold text-default-700">
                                                    {viaje?.x_codigo_postal || "—"}
                                                </strong>
                                            </div>
                                        </div>
                                    </section>

                                    {/* =====================================================
                REFERENCIAS
            ====================================================== */}
                                    <section>
                                        <div className="mb-3 flex items-center gap-2">
                                            <div className="h-4 w-1 rounded-full bg-primary" />

                                            <h3 className="text-xs font-bold uppercase tracking-wider text-default-500">
                                                Referencias
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">

                                            {/* Contenedores */}
                                            <div className="rounded-lg border border-default-200 bg-default-50/50 p-3">
                                                <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wide text-default-400">
                                                    Contenedores
                                                </span>

                                                <Snippet
                                                    color="primary"
                                                    variant="flat"
                                                    size="sm"
                                                    className="max-w-full"
                                                >
                                                    {viaje?.x_references || "—"}
                                                </Snippet>
                                            </div>

                                            {/* Referencia cliente */}
                                            <div className="rounded-lg border border-default-200 bg-default-50/50 p-3">
                                                <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wide text-default-400">
                                                    Referencia cliente
                                                </span>

                                                <Snippet
                                                    color="success"
                                                    variant="flat"
                                                    size="sm"
                                                    className="max-w-full"
                                                >
                                                    {viaje?.client_order_ref || "—"}
                                                </Snippet>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </CardBody>
                        </Card>
                    </Grid>

                    <Card className="mt-3">
                        <CardHeader>
                            <Chip color="secondary">
                                Contenedores
                            </Chip>
                        </CardHeader>
                        <CardBody>
                            <Contenedores></Contenedores>
                        </CardBody>
                    </Card>

                    <Grid size={12}>
                        <Card className="mt-3">
                            <CardHeader>
                                Porcentaje de cumplimiento de envio de estatus del operador
                            </CardHeader>
                            <CardBody>
                                <CumplimientoOperador></CumplimientoOperador>
                            </CardBody>
                        </Card>
                    </Grid>
                </Grid>

                <Grid size={8}>
                    <div className="flex w-full flex-col">
                        <Tabs aria-label="Options" color="primary" radius="full">
                            <Tab key="photos" title="Seguimiento completo">
                                <Card
                                    radius="lg"
                                    shadow="sm"
                                    className="border border-slate-200 overflow-hidden mb-5">
                                    <CardHeader>
                                        Historial de estatus
                                    </CardHeader>
                                    <Divider></Divider>
                                    <CardBody>
                                        <EstatusHistorial key={isLoading}></EstatusHistorial>
                                    </CardBody>
                                </Card>
                            </Tab>
                            <Tab key="music" title="Seguimiento simple">
                                <div className="flex flex-col gap-4">
                                    <SeguimientoSimpleManiobra id_viaje={id_viaje} tipo_maniobra="ingreso"></SeguimientoSimpleManiobra>
                                    <SeguimientoSimpleViaje id_viaje={id_viaje}></SeguimientoSimpleViaje>
                                    <SeguimientoSimpleManiobra id_viaje={id_viaje} tipo_maniobra="retiro"></SeguimientoSimpleManiobra>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </Grid>
            </Grid>

            <PanelEnvio open={open} cerrar={handleClose} id_reporte={null}></PanelEnvio>
            <FormEquipoViaje open={openFormViaje} handleClose={handleCloseFormViaje}></FormEquipoViaje>
            <Notas open={openNotas} onClose={handleCloseNotas} origen_id={id_viaje} model="tms_travel"></Notas>
        </>

    );
}