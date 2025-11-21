import React, { useState, useEffect, useMemo, useContext } from 'react';
import Slide from '@mui/material/Slide';
import SelectFlota from '../../maniobras/maniobras/selects_flota';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FormularioDocumentacion = ({ formData, setFormData }) => {

  const handleSelectChange = (selectedOption, name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: selectedOption ? selectedOption.value : '',
    }));
    console.log('Datos del formulario actualizados:', formData);
  };

  return (
    <>

      <div className='m-2'>
        <SelectFlota
          label={'Vehiculo'}
          id={'vehicle_id'}
          name={'vehicle_id'}
          tipo={'tractor'}
          onChange={handleSelectChange}
          value={formData.vehicle_id}>
        </SelectFlota>
      </div>

      <div className='m-2'>
        <SelectFlota
          label={'Remolque 1'}
          id={'trailer1_id'}
          name={'trailer1_id'}
          tipo={'trailer'}
          onChange={handleSelectChange}
          value={formData.trailer1_id}>
        </SelectFlota>
      </div>

      <div className='m-2'>
        <SelectFlota
          label={'Remolque 2'}
          id={'trailer2_id'}
          name={'trailer2_id'}
          tipo={'trailer'}
          onChange={handleSelectChange}
          value={formData.trailer2_id}>
        </SelectFlota>
      </div>

      <div className='m-2'>
        <SelectFlota
          label={'Dolly'}
          id={'dolly_id'}
          name={'dolly_id'}
          tipo={'dolly'}
          onChange={handleSelectChange}
          value={formData.dolly_id}>
        </SelectFlota>
      </div>

      <div className='m-2'>
        <SelectFlota
          label={'Motogenerador 1'}
          id={'x_motogenerador_1'}
          name={'x_motogenerador_1'}
          tipo={'other'}
          onChange={handleSelectChange}
          value={formData.x_motogenerador_1}>
        </SelectFlota>
      </div>

      <div className='m-2'>
        <SelectFlota
          label={'Motogenerador 2'}
          id={'x_motogenerador_2'}
          name={'x_motogenerador_2'}
          tipo={'other'}
          onChange={handleSelectChange}
          value={formData.x_motogenerador_2}>
        </SelectFlota>
      </div>
    </>
  );
};

export default FormularioDocumentacion;
