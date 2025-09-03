import { Button, Chip, Progress, Spacer } from "@heroui/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';
import BasicButtons2 from './seguimiento';
import Box from '@mui/material/Box';
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
import { useDisclosure } from "@heroui/react";
import DialogActions from '@mui/material/DialogActions';
import WhatsAppContatcsTravel from "./canales/tabla";

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

  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onOpenChange: onOpenChange1,
  } = useDisclosure();

  return (
    <>
      {isLoading && (
        <Box sx={{ width: '100%' }}>
          <Progress isIndeterminate aria-label="Loading..." size="sm" />
        </Box>
      )}

      <div className="flex items-center justify-between p-3"
        style={{
          background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)'
        }}>
        <div className="min-w-0 flex-1">
          <h1 className="h1">
            <Chip color='primary' size='lg' radius='md'>{viaje?.name}</Chip>
          </h1>
          <div className="sm:space-x-3 mt-3 flex flex-wrap gap-2 text-white">
            <span>ID: {id_viaje}</span>
            <span>Vehículo: {viaje?.vehicle?.name}</span>
            <span>Operador: {viaje?.employee?.name}</span>
            <span>Cliente: {viaje?.partner?.name}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            color='success'
            onPress={() => onOpen1()}
            className="text-white">
            <i class="bi bi-whatsapp"></i>
            Destinatarios
          </Button>
          <Button
            color='primary'
            onPress={handleClickOpenCorreos}>
            <i class="bi bi-envelope-at"></i>
            Correos electronicos
          </Button>
        </div>
      </div>

      <Box sx={{ width: '100%' }}>
        <TabContext
          value={value}>
          <Box sx={{
            background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
            color: 'white',
          }}>
            <TabList
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              textColor="inherit"
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: 'white',
                  height: '3px',
                }
              }}>
              <Tab sx={{ fontFamily: 'Inter' }} label="Seguimiento" value="1" />
              <Tab sx={{ fontFamily: 'Inter' }} label="Mapa" value="2" />
              <Tab sx={{ fontFamily: 'Inter' }} label="Documentos" value="3" />
              <Tab sx={{ fontFamily: 'Inter' }} label="Cambio de equipo" value="4" />
              <Tab sx={{ fontFamily: 'Inter' }} label="Detenciones" value="5" />
              <Tab sx={{ fontFamily: 'Inter' }} label="Costos extras" value="6" />
            </TabList>
          </Box>

          <TabPanel value="1" sx={{ backgroundColor: '#f8f9fa', padding: 2 }}>
            <BasicButtons2 />
          </TabPanel>
          <TabPanel value="2" sx={{ padding: 0, margin: 0 }}>
            <Map />
          </TabPanel>
          <TabPanel value="3" sx={{ padding: 0 }}>
            <Documentacion />
          </TabPanel>
          <TabPanel value="4" sx={{ padding: 2 }}>
            <IndexCambioEquipo />
          </TabPanel>
          <TabPanel value="5" sx={{ padding: 0 }}>
            <TiemposViajeProvider>
              <Detenciones />
            </TiemposViajeProvider>
          </TabPanel>
          <TabPanel value="6" sx={{ padding: 0 }}>
            <CostosExtrasProvider>
              <FoliosCostosExtrasViaje />
            </CostosExtrasProvider>
          </TabPanel>

        </TabContext>
      </Box>

      <Dialog
        open={openCorreos}
        onClose={handleCloseCorreos}
        maxWidth="md" // similar a size="5xl"
        fullWidth
      >
        <DialogTitle>Destinatarios</DialogTitle>

        <DialogContent dividers>
          <CorreosElectronicosViaje openCorreos={openCorreos} />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseCorreos} color="primary" variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <WhatsAppContatcsTravel isOpen={isOpen1} onOpenChange={onOpenChange1}></WhatsAppContatcsTravel>
    </>
  );
};

export default Viaje;
