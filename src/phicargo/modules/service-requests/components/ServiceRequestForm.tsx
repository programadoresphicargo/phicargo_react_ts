import {
  Box,
  Card,
  CardContent,
  Divider,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';

import { CustomsAgentForm } from './CustomsAgentForm';
import { DeliveryDataForm } from './DeliveryDataForm';
import { EscortForm } from './EscortForm';
import { ExtraServicesForm } from './ExtraServicesForm';
import { GoodsTable } from './goods/GoodsTable';
import { LinesTable } from './lines/LinesTable';
import { NotesForm } from './NotesForm';
import { ServiceForm } from './ServiceForm';
import { useState } from 'react';

export const ServiceRequestForm = () => {
  const [tabSection, setTabSection] = useState<string>('lines');

  return (
    <>
      <Card elevation={4} sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" className="mb-4 font-semibold">
            Solicitud de Servicio
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <ServiceForm />
        </CardContent>
      </Card>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2, mb: 2 }}>
        <Tabs
          value={tabSection}
          onChange={(_, value) => setTabSection(value)}
          aria-label="service-request-tabs"
        >
          <Tab value="lines" label="Lineas" />
          <Tab
            value="delivery-data"
            label="Datos de Entrega o Carga de Mercancia"
          />
          <Tab value="ccp" label="Complemento Carta Porte" />
          <Tab value="aduanal-agent" label="Agente Aduanal" />
          <Tab value="escort" label="Custodia" />
          <Tab value="additional-services" label="Servicios Adicionales" />
          <Tab value="notes" label="Notas" />
        </Tabs>
      </Box>
      {tabSection === 'lines' && <LinesTable />}
      <div
        style={{ display: tabSection === 'delivery-data' ? 'block' : 'none' }}
      >
        <DeliveryDataForm />
      </div>
      {tabSection === 'ccp' && <GoodsTable />}
      <div
        style={{ display: tabSection === 'aduanal-agent' ? 'block' : 'none' }}
      >
        <CustomsAgentForm />
      </div>
      <div style={{ display: tabSection === 'escort' ? 'block' : 'none' }}>
        <EscortForm />
      </div>
      <div
        style={{
          display: tabSection === 'additional-services' ? 'block' : 'none',
        }}
      >
        <ExtraServicesForm />
      </div>
      <div style={{ display: tabSection === 'notes' ? 'block' : 'none' }}>
        <NotesForm />
      </div>
    </>
  );
};

