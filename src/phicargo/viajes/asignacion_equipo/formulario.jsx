import React, { useState } from 'react';
import { ViajeProvider } from '../context/viajeContext'
import ViajesActivos from './viajes';
import ViajesProgramados from './viajes';
import { Grid } from '@mui/system';
import SelectFlota from '@/phicargo/maniobras/maniobras/selects_flota';

const FormularioAsignacionEquipo = () => {

    const [formData, setFormData] = useState({});

    const handleSelectChange = (selectedOption, name) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: selectedOption ? selectedOption : null,
        }));
        console.log('Datos del formulario actualizados:', formData);
    };

    return (
        <Grid padding={2}>
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
