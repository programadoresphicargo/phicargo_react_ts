import { Button, Input } from "@heroui/react";
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import odooApi from '@/api/odoo-api';
import { Terminal } from "./type";
import { Controller, useForm } from "react-hook-form";

const formInitialState: Terminal = {
    id_terminal: null,
    terminal: ""
};

function FormularioTerminales({ open, onClose, id_terminal }: { open: boolean, onClose: () => void, id_terminal: number | null }) {

    const [isLoading, setIsLoading] = useState(false);
    const { control, handleSubmit, reset } = useForm<Terminal>({
        defaultValues: formInitialState,
    });

    useEffect(() => {
        const fetchTerminalData = async () => {
            try {
                setIsLoading(true);

                const response = await odooApi.get(
                    '/maniobras/terminales/by_id_terminal/' + id_terminal
                );

                reset(response.data);

            } catch (error) {
                console.error("Error al obtener los datos del terminal:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id_terminal) {
            fetchTerminalData();
        } else {
            reset(formInitialState);
        }

    }, [id_terminal, reset]);

    const actualizar = (data: Terminal) => {
        if (!id_terminal) return;
        setIsLoading(true);
        odooApi.post('/maniobras/terminales/update/' + id_terminal, data)
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    onClose();
                }
                setIsLoading(false);
            })
            .catch(error => {
                toast.error('Error:' + error);
                setIsLoading(false);
            });
    };

    const registrar = (data: Terminal) => {
        setIsLoading(true);
        odooApi.post('/maniobras/terminales/create/', data)
            .then(response => {
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    onClose();
                } else if (response.data.status === "error") {
                    toast.error(response.data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            }).finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle></DialogTitle>
                <DialogContent>

                    <div className="flex flex-wrap gap-2 items-center mb-3">
                        {!id_terminal && (
                            <Button type="button"
                                color="primary"
                                onPress={() => handleSubmit(registrar)()} isLoading={isLoading}
                                radius="full">Guardar</Button>
                        )}
                        {id_terminal && (
                            <Button
                                type="button"
                                color="success"
                                onPress={() => handleSubmit(actualizar)()}
                                isLoading={isLoading}
                                className="text-white"
                                radius="full"
                            >
                                Actualizar
                            </Button>
                        )}
                    </div>

                    <Controller
                        control={control}
                        name="terminal"
                        rules={{ required: "Es requerido" }}
                        render={({ field, fieldState }) => (
                            <Input
                                label='Nombre terminal'
                                variant="bordered"
                                type="text"
                                id="terminal"
                                value={field.value || ""}
                                onValueChange={(val: string) => field.onChange(val)}
                                isInvalid={fieldState.invalid}
                                errorMessage={fieldState.error?.message}
                            />
                        )}
                    />

                </DialogContent>
            </Dialog>
        </>
    );
}

export default FormularioTerminales;
