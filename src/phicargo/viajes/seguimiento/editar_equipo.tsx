import { Button } from "@heroui/react";
import React, { useContext, useEffect, useState } from "react";
import Stack from '@mui/material/Stack';
import { ViajeContext } from "../context/viajeContext";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import SelectFlota from "@/phicargo/maniobras/maniobras/selects_flota";
import toast from "react-hot-toast";
import odooApi from "@/api/odoo-api";
import SelectOperador from "@/phicargo/maniobras/maniobras/select_operador";
import { useCatalogos } from "@/phicargo/catalogos/useCatalogos";
import { Controller, useForm } from "react-hook-form";

type ViajeForm = {
    employee_id: number | null;
    vehicle_id: number | null;
    trailer1_id: number | null;
    trailer2_id: number | null;
    dolly_id: number | null;
    x_motogenerador_1?: number | null;
    x_motogenerador_2?: number | null;
};

type Props = {
    open: boolean;
    handleClose: () => void;
};

const FormEquipoViaje: React.FC<Props> = ({
    open,
    handleClose
}) => {

    const {
        control,
        handleSubmit,
        reset,
        watch,
    } = useForm<ViajeForm>({
        defaultValues: {
            vehicle_id: null,
            trailer1_id: null,
            trailer2_id: null,
            dolly_id: null,
        },
    });

    const {
        drivers,
        tractores,
        trailers,
        dollies,
        motogeneradores,
        isLoading
    } = useCatalogos();

    const { id_viaje, viaje, getViaje } = useContext(ViajeContext);
    const [isLoadingUpdate, setLoadingUpdate] = useState(false);

    useEffect(() => {
        if (open) {
            const data = {
                employee_id: viaje?.employee?.id || null,
                vehicle_id: viaje?.vehicle?.id || null,
                trailer1_id: viaje?.trailer1?.id || null,
                trailer2_id: viaje?.trailer2?.id || null,
                dolly_id: viaje?.dolly?.id || null,
                x_motogenerador_1: viaje?.x_motogenerador1?.id || null,
                x_motogenerador_2: viaje?.x_motogenerador2?.id || null,
            };
            reset(data);
        }
    }, [open, viaje]);

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open]);

    const SaveForm = async (data: ViajeForm) => {
        try {
            setLoadingUpdate(true);

            let url = '/tms_travel/' + id_viaje;
            const res = await odooApi.patch(url, data);

            if (res.data.status === "success") {
                toast.success(res.data.message);
                getViaje(id_viaje);
                handleClose();
            }

        } catch (error: any) {
            const detail = error.response?.data?.detail || error.message;
            toast.error("Error: " + detail);
        } finally {
            setLoadingUpdate(false);
        }
    };

    return (
        <>
            <React.Fragment>
                <Dialog
                    open={open}
                    keepMounted
                    aria-describedby="alert-dialog-slide-description"
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: "20px" // puedes subirlo a 20, 24, etc.
                        }
                    }}
                >
                    <DialogTitle>{"Equipo asignado a viaje"}</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2}>

                            <Controller
                                control={control}
                                name="employee_id"
                                rules={{ required: "Operador es requerido" }}
                                render={({ field }) => (
                                    <SelectOperador
                                        label={'Operador'}
                                        id={'employee_id'}
                                        name={'employee_id'}
                                        onChange={(val: number | null) => field.onChange(val)}
                                        value={field.value ?? undefined}
                                        options={drivers}
                                        isLoading={isLoading}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="vehicle_id"
                                rules={{ required: "Vehiculo es requerido" }}
                                render={({ field }) => (
                                    <SelectFlota
                                        id="vehicle_id"
                                        label="Vehiculo"
                                        name="vehicle_id"
                                        onChange={(val: number | null) => field.onChange(val)}
                                        value={field.value ?? undefined}
                                        options={tractores}
                                        isLoading={isLoading}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="trailer1_id"
                                render={({ field }) => (
                                    <SelectFlota
                                        id="trailer1_id"
                                        label="Remolque 1"
                                        name="trailer1_id"
                                        onChange={(val: number | null) => field.onChange(val)}
                                        value={field.value ?? undefined}
                                        options={trailers}
                                        isLoading={isLoading}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="trailer2_id"
                                render={({ field }) => (
                                    <SelectFlota
                                        id="trailer2_id"
                                        label="Remolque 2"
                                        name="trailer2_id"
                                        onChange={(val: number | null) => field.onChange(val)}
                                        value={field.value ?? undefined}
                                        options={trailers}
                                        isLoading={isLoading}
                                    />
                                )}
                            />

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
                                        options={dollies}
                                        isLoading={isLoading}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="x_motogenerador_1"
                                render={({ field }) => (
                                    <SelectFlota
                                        id="x_motogenerador_1"
                                        label="Motogenerador 1"
                                        name="x_motogenerador_1"
                                        onChange={(val: number | null) => field.onChange(val)}
                                        value={field.value ?? undefined}
                                        options={motogeneradores}
                                        isLoading={isLoading}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="x_motogenerador_2"
                                render={({ field }) => (
                                    <SelectFlota
                                        id="x_motogenerador_2"
                                        label="Motogenerador 2"
                                        name="x_motogenerador_2"
                                        onChange={(val: number | null) => field.onChange(val)}
                                        value={field.value ?? undefined}
                                        options={motogeneradores}
                                        isLoading={isLoading}
                                    />
                                )}
                            />

                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onPress={handleClose} radius="full">Cancelar</Button>
                        <Button onPress={() => handleSubmit(SaveForm)()}
                            color="success"
                            className="text-white"
                            radius="full" isLoading={isLoadingUpdate}>
                            <i className="bi bi-floppy-fill">
                            </i>Guardar
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </>
    );
}

export default FormEquipoViaje;