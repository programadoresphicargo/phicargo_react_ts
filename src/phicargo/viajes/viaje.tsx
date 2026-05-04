import { Button, Chip, Progress } from "@heroui/react";
import React, { useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import CorreosElectronicosViaje from './correos/correos_electronicos';
import { CostosExtrasProvider } from '../costos/context/context';
import Detenciones from './detenciones/detenciones';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Documentacion from './documentacion/documentacion';
import FoliosCostosExtrasViaje from './costos_extras/tabla';
import Map from './mapa/mapa';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { TiemposViajeProvider } from './detenciones/TiemposViajeContext';
import { ViajeContext } from './context/viajeContext';
import { useJourneyDialogs } from './seguimiento/funciones';
import DialogActions from '@mui/material/DialogActions';
import PlantaViaje from "./plantas/tabla";
import Seguimiento from "./seguimiento";
import SolicitudesEquipoViaje from "./solicitudes/tabla";
import { AlmacenProvider } from "../almacen/contexto/contexto";
import SolicitudesLlantasViajesIndex from "./llantas/index_solicitudes_llantas";

type ViajeProps = {
  idViaje: number;
};

const Viaje: React.FC<ViajeProps> = ({
  idViaje
}) => {

  const { id_viaje, viaje, getViaje, setIDViaje, isLoading } = useContext(ViajeContext);

  useEffect(() => {
    setIDViaje(idViaje);
  }, [idViaje]);

  useEffect(() => {
    if (id_viaje) {
      getViaje(id_viaje);
    }
  }, [id_viaje]);

  const { comprobar_operador, comprobar_horarios } = useJourneyDialogs();

  const [value, setValue] = React.useState('1');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
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

      <div className="flex items-center justify-between p-3"
        style={{
          background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)'
        }}>
        <div className="min-w-0 flex-1">
          <h1 className="h1">
            <Chip color='primary' size='lg'>{viaje?.name}</Chip>
          </h1>
          <div className="sm:space-x-3 mt-3 flex flex-wrap gap-2 text-white">
            <span>ID: {id_viaje}</span>
            <span>Vehículo: {viaje?.vehicle?.name}</span>
            <span>Operador: {viaje?.employee?.name}</span>
            <span>Cliente: {viaje?.partner?.name}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <PlantaViaje></PlantaViaje>
          <Button
            radius="full"
            color='primary'
            onPress={handleClickOpenCorreos}>
            <i className="bi bi-envelope-at"></i>
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
              <Tab sx={{ fontFamily: 'Inter' }} label="Detenciones" value="4" />
              <Tab sx={{ fontFamily: 'Inter' }} label="Costos extras" value="5" />
              <Tab sx={{ fontFamily: 'Inter' }} label="Solicitudes de equipo" value="6" />
              <Tab sx={{ fontFamily: 'Inter' }} label="Llantas de refacción" value="7" />
            </TabList>
          </Box>

          <TabPanel value="1">
            {value === "1" && <Seguimiento />}
          </TabPanel>

          <TabPanel value="2" sx={{ padding: 0 }}>
            {value === "2" && <Map />}
          </TabPanel>

          <TabPanel value="3" sx={{ padding: 0 }}>
            {value === "3" && <Documentacion />}
          </TabPanel>

          <TabPanel value="4" sx={{ padding: 0 }}>
            {value === "4" && (
              <TiemposViajeProvider>
                <Detenciones />
              </TiemposViajeProvider>
            )}
          </TabPanel>

          <TabPanel value="5" sx={{ padding: 0 }}>
            {value === "5" && (
              <CostosExtrasProvider>
                <FoliosCostosExtrasViaje />
              </CostosExtrasProvider>
            )}
          </TabPanel>

          <TabPanel value="6" sx={{ padding: 0 }}>
            {value === "6" && (
              <AlmacenProvider>
                <SolicitudesEquipoViaje />
              </AlmacenProvider>
            )}
          </TabPanel>

          <TabPanel value="7" sx={{ padding: 0 }}>
            {value === "7" && (
              <SolicitudesLlantasViajesIndex></SolicitudesLlantasViajesIndex>
            )}
          </TabPanel>

        </TabContext>
      </Box>

      <Dialog
        open={openCorreos}
        onClose={handleCloseCorreos}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Destinatarios</DialogTitle>

        <DialogContent dividers>
          <CorreosElectronicosViaje openCorreos={openCorreos} />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseCorreos} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default Viaje;
