import React, { useState } from 'react';
import { ViajeProvider } from '../context/viajeContext'
import ViajesActivos from './viajes';
import ViajesProgramados from './viajes';
import { Grid } from '@mui/system';
import SelectFlota from '@/phicargo/maniobras/maniobras/selects_flota';
import { Button } from '@heroui/react';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';

const FormularioAsignacionEquipo = ({ id_cp }) => {

    const [formData, setFormData] = useState({
        id_cp: id_cp
    });
    const [isLoading, setLoading] = useState(false);

    const handleSelectChange = (selectedOption, name) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: selectedOption ? selectedOption : null,
        }));
        console.log('Datos del formulario actualizados:', formData);
    };

    const guardar = async () => {
        try {
            setLoading(true);
            const response = await odooApi.post('/preasignacion_equipo/', formData);
            if (response.data.status == "success") {
                toast.success(response.data.message);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            const mensaje =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.message ||
                'Error desconocido';
            toast.error('Error al obtener los datos:' + mensaje);
        }
    };

    return (
        <Grid padding={2}>
            <div className='mb-3'>
                <Button color='success' className='text-white' radius='full' onPress={() => guardar()} isLoading={isLoading}>Guardar asignación</Button>
            </div>
            <div className="w-full flex flex-row flex-wrap gap-4">
                <SelectFlota
                    label={'Remolque 1'}
                    id={'trailer1_id'}
                    name={'trailer1_id'}
                    onChange={handleSelectChange}
                    value={formData.trailer1_id}
                    tipo={'trailer'}
                />

                <SelectFlota
                    label={'Remolque 2'}
                    id={'trailer2_id'}
                    name={'trailer2_id'}
                    onChange={handleSelectChange}
                    value={formData.trailer2_id}
                    tipo={'trailer'}
                />

                <SelectFlota
                    label={'Dolly'}
                    id={'dolly_id'}
                    name={'dolly_id'}
                    onChange={handleSelectChange}
                    value={formData.dolly_id}
                    tipo={'dolly'}
                />

                <SelectFlota
                    label={'Motogenerador'}
                    id={'motogenerador1_id'}
                    name={'motogenerador1_id'}
                    onChange={handleSelectChange}
                    value={formData.motogenerador1_id}
                    tipo={'other'}
                />

                <SelectFlota
                    label={'Motogenerador'}
                    id={'motogenerador2_id'}
                    name={'motogenerador2_id'}
                    onChange={handleSelectChange}
                    value={formData.motogenerador2_id}
                    tipo={'other'}
                />
            </div>
        </Grid>
    );
};

export default FormularioAsignacionEquipo;
