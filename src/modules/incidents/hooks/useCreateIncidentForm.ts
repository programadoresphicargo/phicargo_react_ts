import { useState, useMemo, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import dayjs from 'dayjs';
import type { IncidentCreate } from '../models';
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
  state: 'pending_validation',
  discountAmount: null,
  discountTotal: null,
  discountReason: null,
  discountComments: null,
  periodicidad: ''
};

export function useCreateIncidentForm({
  driverId,
  inspection_id2,
  onSuccess,
}: {
  driverId?: number;
  inspection_id2?: number,
  onSuccess?: () => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [createUnavailability, setCreateUnavailability] = useState(false);
  const [createDiscount, setCreateDiscount] = useState(false);

  const [isDirectionReport, setIsDirectionReport] = useState(false);

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
    if (isDirectionReport) {
      data.isDriverResponsible = false;
    }
    mutate(
      {
        driverId: driverIdToUse,
        incident: { ...data },
        files,
        inspectionid: inspection_id2
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

  useEffect(() => {
    form.setValue('discountAmount', null);
    form.setValue('discountTotal', null);
    form.setValue('discountReason', null);
    form.setValue('discountComments', null);
  }, [createDiscount]);

  return {
    form,
    files,
    setFiles,
    createUnavailability,
    setCreateUnavailability,
    incidenceOptions,
    damageCostDisabled,
    handleSubmit,
    isPending,
    isDirectionReport,
    createDiscount,
    setCreateDiscount
  };
}

