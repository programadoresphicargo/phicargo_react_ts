import { useEffect, useState, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button as MUIButton,
} from "@mui/material";
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import SelectFlota from '@/phicargo/maniobras/maniobras/selects_flota';
import HistorialCambioEquipo from './historial';
import Swal from "sweetalert2";
import { Button, Card, CardBody, CardHeader, Divider, Progress, Textarea } from '@heroui/react';
import { Controller, useForm } from 'react-hook-form';
import { Flota, OptionFlota } from '@/phicargo/maniobras/maniobras/tipado';

type PreasignacionForm = {
    id_pre_asignacion: number;
    id_cp: number;
    trailer1_id: number | null;
    trailer2_id: number | null;
    dolly_id: number | null;
    motogenerador1_id?: number | null;
    motogenerador2_id?: number | null;
    comentarios: string;
    estado: string;
};

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    data?: any;
};

type HistorialCambioEquipoRef = {
    reload: () => void;
};

const FormularioAsignacionEquipo: React.FC<Props> = ({
    isOpen,
    onOpenChange,
    data
}) => {

    const {
        control,
        handleSubmit,
        reset,
        watch,
    } = useForm<PreasignacionForm>({
        defaultValues: {
            id_cp: data?.id_cp,
            trailer1_id: null,
            trailer2_id: null,
            dolly_id: null,
            comentarios: "",
        },
    });

    const [trailers, setTrailers] = useState<OptionFlota[]>([]);
    const [dollies, setDollies] = useState<OptionFlota[]>([]);
    const [motogeneradores, setMotogeneradores] = useState<OptionFlota[]>([]);
    const [isLoadingFlota, setLoadingFlota] = useState<boolean>(false);

    const historialRef = useRef<HistorialCambioEquipoRef | null>(null);
    const estado = watch("estado");
    const comentarios = watch("comentarios");

    const getFlotaByTipo = async (tipo: string): Promise<OptionFlota[]> => {
        const response = await odooApi.get<Flota[]>(`/vehicles/fleet_type/${tipo}`);

        return response.data.map(item => ({
            key: item.id,
            label: item.name,
            x_tipo_carga: item.x_tipo_carga,
            x_modalidad: item.x_modalidad
        }));
    };

    useEffect(() => {
        const cargarDatos = async () => {
            setLoadingFlota(true);

            try {
                const [trailersData, dolliesData, motogeneradores] = await Promise.all([
                    getFlotaByTipo("trailer"),
                    getFlotaByTipo("dolly"),
                    getFlotaByTipo("other")
                ]);

                setTrailers(trailersData);
                setDollies(dolliesData);
                setMotogeneradores(motogeneradores)

            } catch (error) {
                console.error(error);
            } finally {
                setLoadingFlota(false);
            }
        };

        cargarDatos();
    }, []);

    const [isEditMode, setEditMode] = useState(false);
    const isDisabled = data?.id_pre_asignacion ? !isEditMode : false;
    const [isLoading, setLoading] = useState(false);
    const [filtroActivo, setFiltroActivo] = useState(false);

    const TipoCarga = (waybill_category: number) => {
        if ([25, 28, 33, 39, 42, 47, 49, 52].includes(waybill_category)) {
            return 'imo';
        } else {
            return 'general';
        }
    };

    useEffect(() => {
        setEditMode(false);
        getData();
        setFiltroActivo(false);
    }, [data]);

    const guardar = async (data: PreasignacionForm) => {
        try {
            setLoading(true);

            let url = '/preasignacion_equipo/';

            if (comentarios?.trim()) {
                url += `?comentarios=${encodeURIComponent(comentarios.trim())}`;
            }

            const res = await odooApi.post(url, data);

            if (res.data.status === "success") {
                toast.success(res.data.message);
                historialRef.current?.reload();
            }

            onOpenChange(false);
        } catch (error: any) {
            const detail = error.response?.data?.detail || error.message;
            toast.error("Error: " + detail);
        } finally {
            setLoading(false);
        }
    };

    const actualizar = async (data: PreasignacionForm) => {
        if (!comentarios.trim()) {
            toast.error("El campo comentarios es obligatorio.");
            return;
        }

        try {
            setLoading(true);

            const res = await odooApi.patch(
                `/preasignacion_equipo/${data?.id_pre_asignacion}?comentarios=${encodeURIComponent(comentarios)}`,
                data
            );

            if (res.data.status === "success") {
                toast.success(res.data.message);
                setEditMode(false);
                historialRef.current?.reload();
            }

            setEditMode(false);
        } catch (error: any) {
            toast.error("Error: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const asignar_viaje = async () => {
        try {
            setLoading(true);
            const res = await odooApi.post(`/preasignacion_equipo/asignar_viaje/${data?.id_pre_asignacion}`);
            if (res.data.status === "success") toast.success(res.data.message);
            historialRef.current?.reload();
            getData();

        } catch (error: any) {
            toast.error("Error: " + (error.response?.data?.detail || error.message));
        } finally {
            setLoading(false);
        }
    };

    const cambiar_estado = async (estado: string) => {
        try {
            setLoading(true);
            const res = await odooApi.patch(`/preasignacion_equipo/estado/${data?.id_pre_asignacion}?estado=${estado}&comentario="Se reabrió esta asignación de equipo."`);
            if (res.data.status === "success") toast.success(res.data.message);
            getData();
            historialRef.current?.reload();

        } catch (error: any) {
            toast.error("Error: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const getData = async () => {
        if (!data?.id_pre_asignacion) return;

        try {
            setLoading(true);
            const res = await odooApi.get(`/preasignacion_equipo/${data?.id_pre_asignacion}`);
            reset(res.data);
        } catch (error: any) {
            toast.error("Error: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const confirmarEquipoViaje = async () => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Se enviará la información al viaje",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            await asignar_viaje();
        }
    };

    const confirmarCambioEstadoPreasignacion = async (estado: string) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Se reabrira esta preasignación de equipo",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            await cambiar_estado(estado);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={() => onOpenChange(false)}
            maxWidth="lg"
            fullWidth
            slotProps={{
                paper: {
                    elevation: 3,
                    sx: {
                        borderRadius: "24px",
                        padding: "8px 0",
                    }
                }
            }}>
            <DialogTitle>Asignación de equipo</DialogTitle>

            {isLoading && (
                <Progress isIndeterminate size='sm'></Progress>
            )}

            <DialogContent dividers>

                <div style={{ display: "flex", gap: "20px" }}>
                    <div style={{ flex: 2 }}>

                        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>

                            {data?.id_pre_asignacion == null && (
                                <Button
                                    color="success"
                                    isDisabled={isLoading}
                                    onPress={() => handleSubmit(guardar)()}
                                    className='text-white'
                                    radius='full'
                                >
                                    Guardar asignación
                                </Button>
                            )}

                            {data?.id_pre_asignacion != null && !isEditMode && estado !== 'asignado_viaje' && (
                                <>
                                    <Button
                                        color="primary"
                                        onPress={() => setEditMode(true)}
                                        radius='full'
                                    >
                                        Editar
                                    </Button>

                                    <Button
                                        radius='full'
                                        color="danger"
                                        isDisabled={isLoading}
                                        onPress={confirmarEquipoViaje}
                                    >
                                        Asignar a viaje
                                    </Button>
                                </>
                            )}

                            {data?.id_pre_asignacion != null && isEditMode && (
                                <Button
                                    color="warning"
                                    isDisabled={isLoading}
                                    onPress={() => handleSubmit(actualizar)()}
                                    radius='full'
                                    className='text-white'
                                >
                                    Actualizar
                                </Button>
                            )}

                            {estado == 'asignado_viaje' && (
                                <Button
                                    color="primary"
                                    isDisabled={isLoading}
                                    onPress={() => confirmarCambioEstadoPreasignacion("borrador")}
                                    radius='full'
                                    className='text-white'
                                >
                                    Reabrir asignación
                                </Button>
                            )}

                            <Button onClick={() => setFiltroActivo(!filtroActivo)} color={filtroActivo ? 'danger' : 'primary'} radius='full'>
                                {filtroActivo ? "Mostrar todos los equipos" : "Aplicar filtros del viaje"}
                            </Button>
                        </div>

                        <div className="w-full flex flex-col gap-4">

                            {data && (
                                <Card fullWidth>
                                    <CardHeader
                                        style={{
                                            background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }}>
                                        Información del CP
                                    </CardHeader>
                                    <Divider></Divider>
                                    <CardBody>
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "1fr 1fr",
                                                gap: "14px",
                                                fontSize: "14px"
                                            }}
                                        >
                                            <div>
                                                <div style={{ color: "#6B7280", fontSize: "12px" }}>CP</div>
                                                <div style={{ fontWeight: 600 }}>{data.name}</div>
                                            </div>

                                            <div>
                                                <div style={{ color: "#6B7280", fontSize: "12px" }}>Modo</div>
                                                <div style={{ fontWeight: 600 }}>{data.x_modo_bel}</div>
                                            </div>

                                            <div>
                                                <div style={{ color: "#6B7280", fontSize: "12px" }}>Tipo</div>
                                                <div style={{ fontWeight: 600 }}>{data.x_tipo_bel}</div>
                                            </div>

                                            <div>
                                                <div style={{ color: "#6B7280", fontSize: "12px" }}>Contenedor</div>
                                                <div style={{ fontWeight: 600 }}>{data.x_reference}</div>
                                            </div>

                                            <div>
                                                <div style={{ color: "#6B7280", fontSize: "12px" }}>Ruta</div>
                                                <div style={{ fontWeight: 600 }}>{data.x_ruta_bel}</div>
                                            </div>

                                            <div>
                                                <div style={{ color: "#6B7280", fontSize: "12px" }}>Clase</div>
                                                <div style={{ fontWeight: 600 }}>{data.x_clase_bel}</div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            )}

                            <Card fullWidth>
                                <CardHeader
                                    style={{
                                        background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}>
                                    Equipo asignado
                                </CardHeader>
                                <Divider></Divider>
                                <CardBody>
                                    <div className="w-full grid grid-cols-2 gap-4">
                                        <Controller
                                            control={control}
                                            name="trailer1_id"
                                            render={({ field }) => (
                                                <SelectFlota
                                                    label="Remolque 1"
                                                    id={'trailer1_id'}
                                                    name="trailer1_id"
                                                    onChange={(val: number | null) => field.onChange(val)}
                                                    value={field.value ?? undefined}
                                                    disabled={isDisabled}
                                                    filtroActivo={filtroActivo}
                                                    modalidad={data?.x_tipo_bel == 'single' ? 'sencillo' : 'full'}
                                                    tipoCarga={TipoCarga(data?.waybill_category)}
                                                    isLoading={isLoadingFlota}
                                                    options={trailers}
                                                />
                                            )}
                                        />
                                        {data?.x_tipo_bel == 'full' && (
                                            <Controller
                                                control={control}
                                                name="trailer2_id"
                                                render={({ field }) => (
                                                    <SelectFlota
                                                        label="Remolque 2"
                                                        id="trailer2_id"
                                                        name="trailer2_id"
                                                        onChange={(val: number | null) => field.onChange(val)}
                                                        value={field.value ?? undefined}
                                                        disabled={isDisabled}
                                                        filtroActivo={filtroActivo}
                                                        modalidad={data?.x_tipo_bel == 'single' ? 'sencillo' : 'full'}
                                                        tipoCarga={TipoCarga(data?.waybill_category)}
                                                        isLoading={isLoadingFlota}
                                                        options={trailers}
                                                    />
                                                )}
                                            />
                                        )}

                                        {data?.x_tipo_bel == 'full' && (
                                            <Controller
                                                control={control}
                                                name="dolly_id"
                                                render={({ field }) => (
                                                    <SelectFlota
                                                        id="dolly_id"
                                                        label="Dolly"
                                                        name="dolly_id"
                                                        onChange={(val: number | null) => field.onChange(val)}
                                                        value={field.value ?? undefined}
                                                        disabled={isDisabled}
                                                        isLoading={isLoadingFlota}
                                                        options={dollies}
                                                    />
                                                )}
                                            />
                                        )}

                                        <Controller
                                            control={control}
                                            name="motogenerador1_id"
                                            render={({ field }) => (
                                                <SelectFlota
                                                    id="motogenerador1_id"
                                                    label="Motogenerador 1"
                                                    name="motogenerador1_id"
                                                    onChange={(val: number | null) => field.onChange(val)}
                                                    value={field.value ?? undefined}
                                                    disabled={isDisabled}
                                                    isLoading={isLoadingFlota}
                                                    options={motogeneradores}
                                                />
                                            )}
                                        />

                                        {data?.x_tipo_bel == 'full' && (
                                            <Controller
                                                control={control}
                                                name="motogenerador2_id"
                                                render={({ field }) => (
                                                    <SelectFlota
                                                        id="motogenerador2_id"
                                                        label="Motogenerador 2"
                                                        name="motogenerador2_id"
                                                        onChange={(val: number | null) => field.onChange(val)}
                                                        value={field.value ?? undefined}
                                                        disabled={isDisabled}
                                                        isLoading={isLoadingFlota}
                                                        options={motogeneradores}
                                                    />
                                                )}
                                            />
                                        )}

                                        <Controller
                                            control={control}
                                            name="comentarios"
                                            render={({ field }) => (
                                                <Textarea
                                                    label="Comentarios"
                                                    variant={isDisabled ? "flat" : "bordered"}
                                                    isDisabled={isDisabled}
                                                    value={field.value || ""}
                                                    onValueChange={(val: string) => field.onChange(val)}
                                                />)}
                                        />

                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>

                    <div style={{
                        flex: 2,
                        height: 600,
                        overflowY: "auto",
                        paddingRight: "5px"
                    }}>
                        <HistorialCambioEquipo ref={historialRef} id_pre_asignacion={data?.id_pre_asignacion} />
                    </div>
                </div>

            </DialogContent>

            <DialogActions>
                <MUIButton color="error" onClick={() => onOpenChange(false)}>
                    Cerrar
                </MUIButton>
            </DialogActions>
        </Dialog >
    );
};

export default FormularioAsignacionEquipo;
