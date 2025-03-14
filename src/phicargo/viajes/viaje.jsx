import { Button, Chip, Progress, Spacer } from "@heroui/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';

import BasicButtons2 from './seguimiento';
import Box from '@mui/material/Box';
import Checklist from './checklist/checklist';
import CorreosElectronicosViaje from './correos/correos_electronicos';
import { CostosExtrasProvider } from '../costos/context/context';
import Detenciones from './detenciones/detenciones';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Documentacion from './documentacion/documentacion';
import FoliosCostosExtras from '../costos/folios/tabla';
import FoliosCostosExtrasViaje from './costos_extras/tabla';
import IndexCambioEquipo from './cambio_equipo/documentacion';
import Map from './mapa/mapa';
import Notificaciones from './panel_notificaciones/panel';
import Slide from '@mui/material/Slide';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { TiemposViajeProvider } from './detenciones/TiemposViajeContext';
import { ViajeContext } from './context/viajeContext';
import { fontFamily } from '@mui/system';
import { useJourneyDialogs } from './seguimiento/funciones';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Viaje = ({ }) => {

  const { comprobar_operador, comprobar_horarios } = useJourneyDialogs();
  const { id_viaje, viaje, getViaje, loading, error, setIDViaje, isLoading } = useContext(ViajeContext);

  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [openCorreos, setOpenCorreos] = React.useState(false);

  const handleClickOpenCorreos = async () => {
    const isHorariosCorrect = await comprobar_horarios();
    if (!isHorariosCorrect) {
      return;
    }

    const isOperadorCorrect = await comprobar_operador();
    if (isOperadorCorrect) {
      setOpenCorreos(true);
    }
  };

  const handleCloseCorreos = () => {
    setOpenCorreos(false);
  };

  return (
    <>
      {isLoading && (
        <Box sx={{ width: '100%' }}>
          <Progress isIndeterminate aria-label="Loading..." size="sm" />
        </Box>
      )}

      <div className="flex items-center justify-between p-3">
        <div className="min-w-0 flex-1">
          <h1 className="h1">
            <Chip color='primary' size='lg' radius='md'>{viaje.name}</Chip>
          </h1>
          <div className="sm:space-x-3 mt-3">
            <span>
              {viaje.vehiculo}
            </span>
            <span>
              {viaje.operador}
            </span>
            <span>
              ({viaje.id_cliente}) {viaje.cliente}
            </span>
          </div>
        </div>
        <div className="mt-5 flex lg:ml-4 lg:mt-0">
          <Button color='primary' onPress={handleClickOpenCorreos}>
            <i class="bi bi-envelope-at"></i>
            Correos electronicos
          </Button>
        </div>
      </div>

      <Box sx={{ width: '100%' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange}>
              <Tab sx={{ fontFamily: 'Inter' }} label="Seguimiento" value="1" />
              <Tab sx={{ fontFamily: 'Inter' }} label="Checklist" value="2" />
              <Tab sx={{ fontFamily: 'Inter' }} label="Mapa" value="3" />
              <Tab sx={{ fontFamily: 'Inter' }} label="Documentos" value="4" />
              <Tab sx={{ fontFamily: 'Inter' }} label="Cambio de equipo" value="5" />
              <Tab sx={{ fontFamily: 'Inter' }} label="Detenciones" value="6" />
              <Tab sx={{ fontFamily: 'Inter' }} label="Costos extras" value="7" />
            </TabList>
          </Box>

          <TabPanel value="1" sx={{ backgroundColor: '#f8f9fa', padding: 2 }}>
            <BasicButtons2 />
          </TabPanel>
          <TabPanel value="2" sx={{ backgroundColor: '#f8f9fa', padding: 2 }}>
            <Checklist />
          </TabPanel>
          <TabPanel value="3" sx={{ padding: 0, margin: 0 }}>
            <Map />
          </TabPanel>
          <TabPanel value="4" sx={{ padding: 0 }}>
            <Documentacion />
          </TabPanel>
          <TabPanel value="5" sx={{ padding: 2 }}>
            <IndexCambioEquipo />
          </TabPanel>
          <TabPanel value="6" sx={{ padding: 0 }}>
            <TiemposViajeProvider>
              <Detenciones />
            </TiemposViajeProvider>
          </TabPanel>
          <TabPanel value="7" sx={{ padding: 0 }}>
            <CostosExtrasProvider>
              <FoliosCostosExtrasViaje />
            </CostosExtrasProvider>
          </TabPanel>

        </TabContext >
      </Box >

      <Dialog
        fullWidth="md"
        maxWidth="md"
        open={openCorreos}
        onClose={handleCloseCorreos}
        TransitionComponent={Transition}
        keepMounted
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '18px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.0)',
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        <DialogTitle>Correos electronicos ligados a viaje</DialogTitle>
        <DialogContent className='p-3'>
          <CorreosElectronicosViaje openCorreos={openCorreos}></CorreosElectronicosViaje>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Viaje;
