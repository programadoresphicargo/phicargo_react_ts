
import {
  AppBar,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Toolbar,
  Typography,
  Box,
  Divider
} from "@mui/material";

import { Button } from "@heroui/react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import odooApi from "@/api/odoo-api";
import SelectFlota from "@/phicargo/maniobras/maniobras/selects_flota";
import { Flota, OptionFlota } from "@/phicargo/maniobras/maniobras/tipado";
import ElectricBoltRoundedIcon from "@mui/icons-material/ElectricBoltRounded";
import React from "react";
import ChecklistPatio from "./checklist_form";
import { OpenArchive } from "@/phicargo/utils/functions";

interface Props {
  open: boolean;
  travelId: number;
  onClose: () => void;
  onSuccess?: () => void;
}

type TravelMGForm = {
  x_motogenerador_1: number | null;
  x_motogenerador_2: number | null;
};

type Position = 1 | 2;

interface MotogeneradorAssignment {
  id: number;
  vehicle_id: number;
  position: Position;
  state: string;
  checklist_id?: number | null;
}

interface AssignmentStatus {
  id: number;
  vehicle_id: number;
  state: string;
  checklist_id?: number | null;
}

const STATE_CONFIG: Record<
  string,
  { label: string; color: "default" | "warning" | "info" | "success" | "error" }
> = {
  pending: { label: "Pendiente de checklist", color: "warning" },
  completed: { label: "Checklist completado", color: "success" },
  rejected: { label: "Rechazado", color: "error" },
  released: { label: "Liberado", color: "default" },
  replaced: { label: "Reemplazado", color: "default" },
};

const DEFAULT_VALUES: TravelMGForm = {
  x_motogenerador_1: null,
  x_motogenerador_2: null,
};

export default function TravelMotogeneratorForm({
  open,
  travelId,
  onClose,
  onSuccess,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
  } = useForm<TravelMGForm>({
    defaultValues: DEFAULT_VALUES,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingAssignment, setIsLoadingAssignment] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingFlota, setIsLoadingFlota] = useState(false);
  const [motogeneradores, setMotogeneradores] = useState<OptionFlota[]>([]);
  const [openChecklist, setOpenChecklist] = React.useState(false);

  const handleClose = () => {
    setOpenChecklist(false);
  };
  const [assignmentStatus, setAssignmentStatus] = useState<
    Record<Position, AssignmentStatus | null>
  >({
    1: null,
    2: null,
  });
  const [selectedAssignment, setSelectedAssignment] =
    useState<MotogeneradorAssignment | null>(null);

  const mg1 = useWatch({
    control,
    name: "x_motogenerador_1",
  });

  const mg2 = useWatch({
    control,
    name: "x_motogenerador_2",
  });

  const cargarFlota = async (signal?: AbortSignal) => {
    try {
      setIsLoadingFlota(true);

      const response = await odooApi.get<Flota[]>(
        "/vehicles/fleet_type/other",
        { signal }
      );

      const options: OptionFlota[] = response.data
        .filter((item) => item.name?.startsWith("MG-"))
        .map((item) => ({
          key: item.id,
          label: item.name,
          x_tipo_carga: item.x_tipo_carga,
          x_modalidad: item.x_modalidad,
        }));

      setMotogeneradores(options);
    } catch (error: any) {
      if (error.code !== "ERR_CANCELED") {
        console.error(error);
        toast.error("No fue posible cargar los motogeneradores.");
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoadingFlota(false);
      }
    }
  };

  const cargarAsignaciones = async () => {
    try {
      setIsLoadingAssignment(true);

      const response = await odooApi.get(
        `/travel_motogenerators/travel/${travelId}`
      );

      const assignments: MotogeneradorAssignment[] =
        response.data.motogeneradores ?? [];

      setIsEditing(assignments.length > 0);

      const assignment1 = assignments.find(
        (item) => item.position === 1
      );

      const assignment2 = assignments.find(
        (item) => item.position === 2
      );

      reset({
        x_motogenerador_1: assignment1?.vehicle_id ?? null,
        x_motogenerador_2: assignment2?.vehicle_id ?? null,
      });

      setAssignmentStatus({
        1: assignment1
          ? {
            id: assignment1.id,
            vehicle_id: assignment1.vehicle_id,
            state: assignment1.state,
            checklist_id: assignment1.checklist_id
          }
          : null,
        2: assignment2
          ? {
            id: assignment2.id,
            vehicle_id: assignment2.vehicle_id,
            state: assignment2.state,
            checklist_id: assignment2.checklist_id
          }
          : null,
      });

    } catch (error: any) {
      console.error(error);
      toast.error("No fue posible consultar las asignaciones.");
    } finally {
      setIsLoadingAssignment(false);
    }
  };

  const abrirChecklist = (position: Position) => {
    const assignment = assignmentStatus[position];

    if (!assignment) {
      toast.warning("Primero debes guardar la asignación.");
      return;
    }

    const selectedVehicle =
      position === 1 ? mg1 : mg2;

    // Comprobar que el equipo seleccionado siga siendo
    // el mismo que está registrado en la base de datos.
    if (assignment.vehicle_id !== selectedVehicle) {
      toast.warning("Guarda primero los cambios de asignación.");
      return;
    }

    if (assignment.checklist_id) {
      OpenArchive(`/checklist/export_mg/${assignment.checklist_id}`);
    } else {
      const currentAssignment: MotogeneradorAssignment = {
        id: assignment.id,
        vehicle_id: assignment.vehicle_id,
        position,
        state: assignment.state,
      };

      setSelectedAssignment(currentAssignment);
      setOpenChecklist(true);
    }
  };

  const renderAssignmentStatus = (
    position: Position,
    vehicleId: number | null
  ) => {
    if (!vehicleId) return null;

    const assignment = assignmentStatus[position];

    // Si el vehículo cambió, no mostrar el estado de la asignación anterior
    if (!assignment || assignment.vehicle_id !== vehicleId) {
      return (
        <Chip
          size="small"
          color="default"
          variant="outlined"
          label="Pendiente de guardar asignación"
        />
      );
    }

    const config = STATE_CONFIG[assignment.state] ?? {
      label: assignment.state,
      color: "default" as const,
    };

    return (
      <Chip
        size="small"
        color={config.color}
        variant="filled"
        label={config.label}
      />
    );
  };

  useEffect(() => {
    if (!open) return;

    cargarFlota();
    cargarAsignaciones();
  }, [open, travelId]);

  const guardar = async (form: TravelMGForm) => {
    const motogeneradores = [
      form.x_motogenerador_1
        ? {
          vehicle_id: form.x_motogenerador_1,
          position: 1,
        }
        : null,
      form.x_motogenerador_2
        ? {
          vehicle_id: form.x_motogenerador_2,
          position: 2,
        }
        : null,
    ].filter(Boolean);

    if (!motogeneradores.length) {
      toast.error("Selecciona al menos un motogenerador.");
      return;
    }

    if (
      form.x_motogenerador_1 &&
      form.x_motogenerador_1 === form.x_motogenerador_2
    ) {
      toast.error("No puedes asignar el mismo motogenerador dos veces.");
      return;
    }

    const payload = {
      travel_id: travelId,
      motogeneradores,
    };

    try {
      setIsSaving(true);

      const response = isEditing
        ? await odooApi.put("/travel_motogenerators/", payload)
        : await odooApi.post("/travel_motogenerators/", payload);

      if (response.data.status === "success") {
        toast.success(response.data.message);
        onClose();
        onSuccess?.();
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail || "Error al guardar la asignación."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const validate = async (form: TravelMGForm) => {
    const motogeneradores = [
      form.x_motogenerador_1
        ? {
          vehicle_id: form.x_motogenerador_1,
          position: 1,
        }
        : null,
      form.x_motogenerador_2
        ? {
          vehicle_id: form.x_motogenerador_2,
          position: 2,
        }
        : null,
    ].filter(Boolean);

    if (!motogeneradores.length) {
      toast.error("Selecciona al menos un motogenerador.");
      return;
    }

    if (
      form.x_motogenerador_1 &&
      form.x_motogenerador_1 === form.x_motogenerador_2
    ) {
      toast.error("No puedes asignar el mismo motogenerador dos veces.");
      return;
    }

    const payload = {
      travel_id: travelId,
      motogeneradores,
    };

    try {
      setIsSaving(true);

      const response = await odooApi.post("/travel_motogenerators/validate/", payload);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        onClose();
        onSuccess?.();
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail || "Error al guardar la asignación."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const opcionesMG2 = motogeneradores.filter(
    (item) => item.key !== mg1
  );

  return (
    <>
      {selectedAssignment && (
        <ChecklistPatio
          open={openChecklist}
          onClose={handleClose}
          solicitud_id={selectedAssignment?.id ?? null}
          vehicle_id={selectedAssignment?.vehicle_id ?? null}
          onSuccess={cargarAsignaciones}
        />
      )}

      <Dialog
        open={open}
        maxWidth="md"
        fullWidth
        onClose={onClose}
      >
        <AppBar
          elevation={0}
          position="relative"
          sx={{
            background: "linear-gradient(90deg, #0b2149, #002887)",
            px: 2,
          }}
        >
          <Toolbar>
            <Typography
              sx={{
                fontSize: 20,
                textTransform: "uppercase",
                flex: 1,
                fontFamily: "Inter",
              }}
            >
              Asignación de motogeneradores
            </Typography>

            <Button
              size="sm"
              variant="ghost"
              className="text-white"
              onPress={onClose}
            >
              Cerrar
            </Button>
          </Toolbar>
        </AppBar>


        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            pt: 3,
            pb: 3,
            backgroundColor: "#F8FAFC",
          }}
        >
          {/* Encabezado */}
          <Box sx={{ mb: 0.5 }}>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              color="#172B4D"
            >
              Equipos asignados al viaje
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Selecciona los motogeneradores correspondientes.
            </Typography>
          </Box>

          {/* Motogenerador 1 */}
          <Box
            sx={{
              p: 2.2,
              borderRadius: 3,
              bgcolor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "#B8CCF5",
                boxShadow: "0 4px 14px rgba(15, 23, 42, 0.07)",
              },
            }}
          >
            <Controller
              control={control}
              name="x_motogenerador_1"
              render={({ field }) => (
                <Stack spacing={1.5}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2.5,
                        bgcolor: "#EAF2FF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#2563EB",
                      }}
                    >
                      <ElectricBoltRoundedIcon />
                    </Box>

                    <Box flex={1}>
                      <Typography
                        fontWeight={700}
                        color="#172B4D"
                        fontSize={14}
                        fontFamily="Inter"
                      >
                        Motogenerador 1
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontFamily="Inter"
                      >
                        Posición 1
                      </Typography>
                    </Box>

                    <Chip
                      label="Equipo 01"
                      size="small"
                      sx={{
                        bgcolor: "#F1F5F9",
                        color: "#475569",
                        fontWeight: 600,
                        fontSize: 11,
                      }}
                    />
                  </Stack>

                  <Divider sx={{ borderColor: "#F1F5F9" }} />

                  <SelectFlota
                    id="motogenerador_1"
                    name="motogenerador_1"
                    label="Seleccionar equipo"
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    isLoading={isLoadingFlota}
                    options={motogeneradores}
                  />

                  <Button
                    onPress={() => abrirChecklist(1)}
                    color="primary"
                    size="sm"
                    isDisabled={!mg1 || isLoadingAssignment}
                  >
                    Checklist
                  </Button>
                  {renderAssignmentStatus(1, field.value)}

                </Stack>
              )}
            />
          </Box>

          {/* Motogenerador 2 */}
          <Box
            sx={{
              p: 2.2,
              borderRadius: 3,
              bgcolor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "#B8CCF5",
                boxShadow: "0 4px 14px rgba(15, 23, 42, 0.07)",
              },
            }}
          >
            <Controller
              control={control}
              name="x_motogenerador_2"
              render={({ field }) => (
                <Stack spacing={1.5}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2.5,
                        bgcolor: "#F1F5F9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#64748B",
                      }}
                    >
                      <ElectricBoltRoundedIcon />
                    </Box>

                    <Box flex={1}>
                      <Typography
                        fontWeight={700}
                        color="#172B4D"
                        fontSize={14}
                        fontFamily="Inter"
                      >
                        Motogenerador 2
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontFamily="Inter"
                      >
                        Posición 2
                      </Typography>
                    </Box>

                    <Chip
                      label="Equipo 02"
                      size="small"
                      sx={{
                        bgcolor: "#F1F5F9",
                        color: "#475569",
                        fontWeight: 600,
                        fontSize: 11,
                      }}
                    />
                  </Stack>

                  <Divider sx={{ borderColor: "#F1F5F9" }} />

                  <SelectFlota
                    id="motogenerador_2"
                    name="motogenerador_2"
                    label="Seleccionar equipo"
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    isLoading={isLoadingFlota}
                    options={opcionesMG2}
                  />

                  {renderAssignmentStatus(2, field.value)}
                  <Button
                    onPress={() => abrirChecklist(2)}
                    color="primary"
                    size="sm"
                    isDisabled={!mg2 || isLoadingAssignment}
                  >
                    Checklist
                  </Button>
                </Stack>
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            size="sm"
            variant="light"
            onPress={onClose}
            isDisabled={isSaving}
          >
            Cancelar
          </Button>

          <Button
            size="sm"
            color="success"
            className="text-white"
            isLoading={isSaving}
            isDisabled={isLoadingAssignment || isLoadingFlota}
            onPress={() => handleSubmit(guardar)()}
          >
            {isEditing ? "Actualizar asignación" : "Guardar asignación"}
          </Button>

          <Button
            size="sm"
            color="danger"
            className="text-white"
            isLoading={isSaving}
            isDisabled={isLoadingAssignment || isLoadingFlota}
            onPress={() => handleSubmit(validate)()}
          >
            Validar y enviar a viaje
          </Button>

        </DialogActions>
      </Dialog>
    </>
  );
}
