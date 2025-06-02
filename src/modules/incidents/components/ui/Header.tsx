import { HeaderBase } from '@/components/ui';

import { IndicatorCard } from '@/components/utils/IndicatorCard';
import { useIncidentsContext } from '../../hooks/useIncidentsContext';
import { useIncidentsQueries } from '../../hooks/quries';
import { Incident, IncidentType } from '../../models';

const getCount = (incidents: Incident[], type: IncidentType) => {
  return incidents.filter((incident) => incident.type === type).length || 0;
};

export const Header = () => {
  const { formatedDateRange } = useIncidentsContext();

  const {
    incidentsQuery: { data: incidents, isLoading },
  } = useIncidentsQueries({
    startDate: formatedDateRange.startDate,
    endDate: formatedDateRange.endDate,
  });

  const operativeIncidents = getCount(incidents || [], 'operative');
  const legalIncidents = getCount(incidents || [], 'legal');
  const cleaningIncidents = getCount(incidents || [], 'cleaning');
  const maintenanceIncidents = getCount(incidents || [], 'maintenance');

  return (
    <HeaderBase backRoute="/menu">
      <div className="flex flex-auto gap-2 mx-2">
        <IndicatorCard
          title="Operativos"
          isLoading={isLoading}
          content={operativeIncidents}
        />
        <IndicatorCard
          title="Legales"
          isLoading={isLoading}
          content={legalIncidents}
        />
        <IndicatorCard
          title="Limpieza"
          isLoading={isLoading}
          content={cleaningIncidents}
        />
        <IndicatorCard
          title="Mantenimiento"
          isLoading={isLoading}
          content={maintenanceIncidents}
        />
      </div>
      <div className="flex flex-col gap-3"></div>
    </HeaderBase>
  );
};

