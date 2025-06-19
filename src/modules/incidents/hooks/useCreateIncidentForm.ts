import { useState, useMemo, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import dayjs from 'dayjs';
import type { IncidentCreate } from '../models';
import { useVehicleQueries } from '@/modules/vehicles/hooks/queries';
import { getIncidentOptions } from '../utilities';
import { useIncidentsQueries } from '../hooks/quries';

export const INCIDENT_TYPES = {
  OPERATIVE: 'operative',
  LEGAL: 'legal',
  CLEANING: 'cleaning',
  MAINTENANCE: 'maintenance',
} as const;

const initialFormState: IncidentCreate = {
  startDate: null,
  endDate: null,
  incident: '',
  comments: '',
  type: INCIDENT_TYPES.OPERATIVE,
  incidentDate: dayjs(),
  damageCost: null,
  isDriverResponsible: true,
  vehicleId: null,
  newVehicleStateId: null,
  driverId: null,
};

export function useCreateIncidentForm({
  driverId,
  onSuccess,
}: {
  driverId?: number;
  onSuccess?: () => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [createUnavailability, setCreateUnavailability] = useState(false);

  const [isDirectionReport, setIsDirectionReport] = useState(false);

  const { vehicleQuery } = useVehicleQueries();
  const {
    createIncident: { mutate, isPending },
  } = useIncidentsQueries({ driverId });

  const form = useForm<IncidentCreate>({
    defaultValues: initialFormState,
  });

  const selectedType = form.watch('type');
  const incidentSelected = form.watch('incident');

  const incidenceOptions = useMemo(
    () => getIncidentOptions(selectedType),
    [selectedType],
  );

  const damageCostDisabled = useMemo(
    () =>
      selectedType !== INCIDENT_TYPES.LEGAL &&
      selectedType !== INCIDENT_TYPES.MAINTENANCE,
    [selectedType],
  );

  const handleSubmit: SubmitHandler<IncidentCreate> = (data) => {
    if (isPending) return;
    const driverIdToUse = driverId || data.driverId;
    if (!driverIdToUse) return;
    mutate(
      {
        driverId: driverIdToUse,
        incident: { ...data },
        files,
      },
      {
        onSuccess: () => {
          onSuccess?.();
          form.reset(initialFormState);
          setFiles([]);
        },
      },
    );
  };

  useEffect(() => {
    if (incidentSelected === 'REPORTE A DIRECCIÓN') {
      form.setValue('isDriverResponsible', false);
      form.setValue('vehicleId', null);
      form.setValue('newVehicleStateId', null);
      setCreateUnavailability(false);
      form.setValue('startDate', null);
      form.setValue('endDate', null);
      setIsDirectionReport(true);
    } else {
      setIsDirectionReport(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incidentSelected]);

  return {
    form,
    files,
    setFiles,
    createUnavailability,
    setCreateUnavailability,
    vehicleQuery,
    incidenceOptions,
    damageCostDisabled,
    handleSubmit,
    isPending,
    isDirectionReport
  };
}

