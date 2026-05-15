import { Progress } from "@heroui/react";
import React, { useEffect } from 'react';
import { Button } from "@heroui/react";
import Stack from '@mui/material/Stack';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { AutocompleteInput, SelectInput, TextInput } from "@/components/inputs";

type Empresa = {
    key: number;
    value: string;
}

type EmpresaResponse = {
    id_empresa: number;
    empresa: string;
}

type BancoResponse = {
    id_banco: number;
    banco: string;
}

type Banco = {
    key: number
    value: string;
}

type Cuenta = {
    id_empresa: number | null;
    id_cuenta: number | null;
    id_banco: number | null;
    moneda: string;
    referencia: string | null;
    tipo: string | null;
}

const initialForm: Cuenta = {
    id_cuenta: null,
    id_empresa: null,
    id_banco: null,
    moneda: "MXN",
    referencia: null,
    tipo: null,
};

const CuentaForm = ({ id_cuenta, onClose }: { id_cuenta: number | null, onClose: () => void }) => {

    const { control, handleSubmit, reset } = useForm<Cuenta>({
        defaultValues: initialForm,
    });

    const [empresas, setEmpresas] = React.useState<Empresa[]>([]);
    const [bancos, setBancos] = React.useState<Banco[]>([]);
    const [isLoading, setLoading] = React.useState(false);

    const getCuenta = async () => {
        try {
            setLoading(true);
            const response = await odooApi.get<Cuenta>('/cuentas/' + id_cuenta);
            reset(response.data);
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            console.error('Error al obtener los datos:', error);
        }
    };

    const registrar = async (data: Cuenta) => {
        try {
            setLoading(true);
            const response = await odooApi.post("/cuentas/", data);
            if (response.data.status === "success") {
                toast.success(response.data.message);
                onClose();
            } else {
                toast.error(response.data);
            }
            setLoading(false);
        } catch (error: any) {
            toast.error("Error de conexión: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const actualizar = async (data: Cuenta) => {
        try {
            setLoading(true);
            const response = await odooApi.patch("/cuentas/" + id_cuenta, data);
            if (response.data.status === "success") {
                toast.success(response.data.message);
                onClose();
            } else {
                toast.error(response.data);
            }
            setLoading(false);
        } catch (error: any) {
            toast.error("Error de conexión: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const getEmpresas = async () => {
        try {
            const response = await odooApi.get<EmpresaResponse[]>("/empresas/get_empresas/");
            const data = response.data.map(item => ({
                key: item.id_empresa,
                value: item.empresa,
            }));
            setEmpresas(data)
        } catch (error: any) {
            toast.error("Error de conexión: " + error.message);
            console.error(error);
        }
    };

    const getBancos = async () => {
        try {
            const response = await odooApi.get<BancoResponse[]>("/bancos/");
            const data = response.data.map(item => ({
                key: item.id_banco,
                value: item.banco,
            }));
            setBancos(data)
        } catch (error: any) {
            toast.error("Error de conexión: " + error.message);
            console.error(error);
        }
    };

    useEffect(() => {
        getEmpresas();
        getBancos();

        if (id_cuenta) {
            getCuenta();
        }
    }, [id_cuenta]);

    return (
        <>
            {isLoading && (
                <Progress isIndeterminate size="sm" className="mb-5"></Progress>
            )}

            {id_cuenta && (<h1 className="mb-5">Cuenta No. {id_cuenta}</h1>)}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                <Stack direction="row">
                    {!id_cuenta ? (
                        <Button color="primary" onPress={() => handleSubmit(registrar)()} radius="full" isLoading={isLoading}>
                            Registrar
                        </Button>
                    ) : (
                        <Button color="success" onPress={() => handleSubmit(actualizar)()} className='text-white' radius="full" isLoading={isLoading}>
                            Actualizar
                        </Button>
                    )}
                </Stack>

                <AutocompleteInput
                    control={control}
                    label="Empresa"
                    name="id_empresa"
                    items={empresas}
                    variant="bordered"
                    rules={{ required: 'Obligatorio' }}
                />

                <AutocompleteInput
                    control={control}
                    label="Banco"
                    name="id_banco"
                    items={bancos}
                    variant="bordered"
                    rules={{ required: 'Obligatorio' }}
                />

                <SelectInput
                    control={control}
                    label="Moneda"
                    name="moneda"
                    variant="bordered"
                    items={
                        [
                            { key: "MXN", value: "MXN" },
                            { key: "USD", value: "USD" }
                        ]
                    }
                    rules={{ required: 'Obligatorio' }}
                ></SelectInput>

                <TextInput
                    control={control}
                    variant="bordered"
                    label="Referencia"
                    name="referencia"
                />

                <SelectInput
                    control={control}
                    label="Tipo"
                    name="tipo"
                    variant="bordered"
                    items={
                        [
                            { key: "Cuenta bancaria", value: "Cuenta bancaria" },
                            { key: "Credito revolvente", value: "Credito revolvente" },
                            { key: "Inversiones", value: "Inversiones" },
                            { key: "Tarjeta de credito", value: "Tarjeta de credito" },
                            { key: "Factoraje", value: "Factoraje" },
                            { key: "Cartera", value: "Cartera" },
                            { key: "Cuenta concentradora", value: "Cuenta concentradora" },
                        ]
                    }
                    rules={{ required: 'Obligatorio' }}
                ></SelectInput>
            </div >
        </>
    );
};

export default CuentaForm;
