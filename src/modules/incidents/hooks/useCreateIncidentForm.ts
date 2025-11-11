import { useState, useMemo, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import dayjs from 'dayjs';
import type { Incident, IncidentCreate, IncidentUpdate } from '../models';
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
  periodicidad: '',
  id_solicitante: 0,
};

type Mode = "create" | "edit";

export function transformIncidentToCreate(incident: Incident): IncidentCreate {
  return {
    incident: incident.incident,
    comments: incident.comments,
    type: incident.type,
    incidentDate: incident.incidentDate ? dayjs(incident.incidentDate) : dayjs(),
    damageCost: incident.damageCost,
    isDriverResponsible: incident.isDriverResponsible,
    state: incident.state,
    vehicleId: incident.vehicle?.id ?? null,
    driverId: incident.driver?.id ?? null,

    // campos extra válidos solo al crear
    startDate: null,
    endDate: null,
    newVehicleStateId: null,
    discountAmount: null,
    discountTotal: null,
    discountReason: null,
    discountComments: null,
    periodicidad: "",
    id_solicitante: 0,
  };
}

export function useCreateIncidentForm({
  mode,
  incident,
  driverId,
  inspection_id2,
  onSuccess,
}: {
  mode: Mode;
  incident?: Incident | null;
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
    updateIncident,
    confirmIncidentMutation
  } = useIncidentsQueries({ driverId });

  const form = useForm<IncidentCreate>({
    defaultValues:
      mode === "edit" && incident
        ? transformIncidentToCreate(incident)
        : initialFormState,
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

  const submitCreate: SubmitHandler<IncidentCreate> = (data) => {
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
    if (mode === "edit" && incident) {
      if (incident.incident === "REPORTE A DIRECCIÓN") {
        setIsDirectionReport(true);
        form.setValue("isDriverResponsible", false);
      }
    }
  }, []);

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

  const confirmIncidentFn = (id?: number) => {
    const toId = id ?? incident?.id;
    if (!toId) return;

    confirmIncidentMutation.mutate(
      { id: toId, state: "confirmed" },
      {
        onSuccess: () => onSuccess?.(),
      }
    );
  };

  const submitUpdate: SubmitHandler<IncidentCreate> = (data) => {
    if (!incident) return;

    const allowed: IncidentUpdate = {
      incident: data.incident,
      comments: data.comments,
      type: data.type,
      incidentDate: data.incidentDate,
      damageCost: data.damageCost,
      isDriverResponsible: data.isDriverResponsible,
      vehicleId: data.vehicleId,
      driverId: data.driverId,
      state: data.state,
    };

    updateIncident.mutate(
      { id: incident.id, updatedItem: allowed },
      {
        onSuccess: () => onSuccess?.(),
      }
    );
  };

  const submit = () =>
    mode === "create"
      ? form.handleSubmit(submitCreate)()
      : form.handleSubmit(submitUpdate)();

  const cancelIncidentFn = (id?: number) => {
    const toId = id ?? incident?.id;
    if (!toId) return;

    confirmIncidentMutation.mutate(
      { id: toId, state: "canceled" },
      {
        onSuccess: () => onSuccess?.(),
      }
    );
  };

  return {
    form,
    files,
    setFiles,
    createUnavailability,
    setCreateUnavailability,
    incidenceOptions,
    damageCostDisabled,
    isPending,
    isDirectionReport,
    createDiscount,
    setCreateDiscount,
    confirmIncident: confirmIncidentFn,
    cancelIncident: cancelIncidentFn,
    submit
  };
}

