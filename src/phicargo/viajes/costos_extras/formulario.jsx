import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Box, Grid } from '@mui/material';
import { ViajeContext } from '../context/viajeContext';
import { Button, select } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import Slide from '@mui/material/Slide';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import { useAuthContext } from '../../modules/auth/hooks';
import CostosExtras from '../viajes/costos_extras/costos_extras/registros';
import CartasPorteCostoExtra from './cartas_porte';
import Stack from '@mui/material/Stack';

const FormularioCostoExtra = ({ onClose }) => {

  const { id_viaje, viaje, getViaje, loading, error, setIDViaje, isLoading } = useContext(ViajeContext);

  const [Loading, setLoading] = useState(false);

  return (
    <>

      <Stack spacing={1} direction="row">
        <Button color='success' size='sm' className='text-white'>Guardar</Button>
        <Button color="primary" size='sm'>Imprimir</Button>
        <Button color="primary" size='sm'>Actualizar</Button>
      </Stack>

      <Grid container>
        <Grid xs={3} className='p-2'>
          <CartasPorteCostoExtra></CartasPorteCostoExtra>
        </Grid>
        <Grid xs={9} className='p-2'>
        </Grid>
      </Grid>
    </>
  );
};

export default FormularioCostoExtra;
