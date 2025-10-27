import { Chip, Dialog, Divider } from '@mui/material';
import { ReactNode } from 'react';
import { MuiModal } from '@/components';
import type {
  VehicleInspection,
  VehicleInspectionQuestion,
} from '../../models';
import { useGetDriverIncidentQuery } from '@/modules/incidents/hooks/quries';
import { CheckCircleOutline, ErrorOutline } from '@mui/icons-material';
import { Alert, LoadingSpinner } from '@/components/ui';
import { FilesList } from '@/components/utils/FilesList';
import { Button, Select, SelectItem, Textarea } from '@heroui/react';
import { EditIncidentModal } from '@/modules/incidents/components/EditIncidentModal';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import { useUpdateVehicleInspectionMutation } from '../../hooks/queries/inspections/useUpdateVehicleInspectionMutation';
import { useGetInspectionChecklistQuery } from '../../hooks/queries';
import { CreateIncidentModal } from '@/modules/incidents/components/CreateIncidentModal';
import { useChangeStateInspectionMutation } from '../../hooks/queries/inspections/useConfirmInspection';

interface Props {
  open: boolean;
  onClose: () => void;
  vehicleInspection: VehicleInspection;
  refresh: () => void;
}

export const VehicleInspectionDetailModal = ({
  open,
  onClose,
  vehicleInspection,
  refresh,
}: Props) => {

  const [isEditing, setIsEditing] = useState(false);

  const {
    query: { data: incident, isLoading: loadingIncident },
  } = useGetDriverIncidentQuery(vehicleInspection.inspection?.incidentId);

  const {
    query: { data: checklist, isLoading: loadingChecklist },
  } = useGetInspectionChecklistQuery(vehicleInspection.inspection?.id);

  const { ChangeStateInspectionMutacion, isLoadingConfirm } = useChangeStateInspectionMutation();
  const { mutate: updateInspection, isPending: updarting } = useUpdateVehicleInspectionMutation();

  const [openCreateIncident, setOpenCreateIncident] = useState(false);
  const handleCreateOpen = () => setOpenCreateIncident(true);
  const handleCreateClose = () => {
    setOpenCreateIncident(false);
    refresh?.();
    onClose();
  };
  const [openEditIncident, setOpenEditIncident] = useState(false);
  const handleOpen = () => setOpenEditIncident(true);
  const handleClose = () => setOpenEditIncident(false);

  const [formData, setFormData] = useState({
    result: null as string | null,
    comments: "",
  });

  useEffect(() => {
    if (vehicleInspection.inspection) {
      setFormData({
        result: vehicleInspection.inspection.result || null,
        comments: vehicleInspection.inspection.comments || "",
      });
    }
  }, [vehicleInspection.inspection]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const cambiar_estado_inspeccion = async (nuevoEstado: string) => {
    Swal.fire({
      title: '¿Confirmar cambio de estado a esta inspección?',
      text: 'Una vez confirmado no podrás editarlo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        ChangeStateInspectionMutacion.mutate(
          {
            inspectionId: vehicleInspection.inspection?.id!,
            state: nuevoEstado,
          },
          {
            onSuccess: (data) => {
              if (data.status === 'success') {
                onClose();
              }
            },
            onError: () => {
              Swal.fire({
                title: 'Error',
                text: 'No se pudo confirmar. Intenta nuevamente.',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            },
          }
        );
      }
    });
  };

  // Guardar cambios
  const handleSave = () => {
    if (!vehicleInspection.inspection?.id) return;

    updateInspection({
      id: vehicleInspection.inspection?.id,
      data: formData,
    }, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  return (
    <MuiModal
      open={open}
      onClose={onClose}
      maxWidth="md"
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="uppercase font-thin text-lg">
            Detalles de Revisión:{' '}
            <span className="font-bold">{vehicleInspection.driver?.name}</span>
          </h2>
        </div>
      }
    >

      <div className="flex flex-col gap-4 p-4 w-full">
        <DetailCard title={`Revisión: ${vehicleInspection.inspection?.id}`}>
          {vehicleInspection.inspection?.inspectionState !== 'confirmed' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {!isEditing && (
                  <Button
                    color="success"
                    className="text-white"
                    radius="full"
                    onPress={() => cambiar_estado_inspeccion("confirmed")}
                    isLoading={isLoadingConfirm}
                  >
                    Confirmar revisión
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>

              <Button color='warning' onPress={() => cambiar_estado_inspeccion("draft")} radius='full' className='text-white'>Regresar a Borrador</Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p className="text-sm text-gray-500">Estado</p>
                <p>{vehicleInspection.inspection?.inspectionState}</p>

                <p className="text-sm text-gray-500">Usuario confirmo</p>
                <p>{vehicleInspection.inspection?.userConfirmed}</p>

                <p className="text-sm text-gray-500">Fecha confirmación</p>
                <p>{vehicleInspection.inspection?.confirmedDate.toString()}</p>
              </div>
            </>
          )}
        </DetailCard>
      </div>

      <div className="flex flex-col gap-4 p-4 w-full">

        {/* Sección de información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailCard title="Información de Revisión">

            {isEditing && (
              <Button
                color="primary"
                className="text-white"
                radius="full"
                onPress={() => handleSave()}
                isLoading={updarting}
              >
                {updarting ? "Guardando..." : "Guardar cambios"}
              </Button>
            )}
            <Button
              color={isEditing ? "secondary" : "danger"}
              className="text-white"
              isDisabled={vehicleInspection.inspection?.inspectionState == 'confirmed' ? true : false}
              radius="full"
              onPress={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancelar edición" : "Editar"}
            </Button>

            <div>
              <p className="text-sm text-gray-500 uppercase">
                Fecha de Revisión
              </p>
              <p>
                {vehicleInspection.inspection?.inspectionDate?.format(
                  'DD/MM/YYYY',
                ) || 'No especificada'}
              </p>
            </div>

            <div>
              {vehicleInspection.inspection?.result ? (
                <>
                  <Select
                    label="Resultado"
                    isDisabled={vehicleInspection.inspection?.inspectionState == 'confirmed' ? true : false || !isEditing}
                    selectedKeys={[formData.result || '']}
                    onSelectionChange={(keys) =>
                      handleChange("result", Array.from(keys)[0] as string)
                    }
                    variant="bordered"
                  >
                    <SelectItem key="approved">Aprobado</SelectItem>
                    <SelectItem key="rejected">Rechazado</SelectItem>
                  </Select>
                </>
              ) : (
                <Chip label="No Revisada" color="default" size="small" />
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500">Comentarios</p>
              <div className="flex items-center gap-1">
                <Textarea
                  isDisabled={vehicleInspection.inspection?.inspectionState == 'confirmed' ? true : false || !isEditing}
                  value={formData.comments}
                  onChange={(e) => handleChange("comments", e.target.value)}
                  variant="bordered"
                />
              </div>
            </div>
          </DetailCard>

          <DetailCard title="Incidencia Asociada">
            {loadingIncident && <LoadingSpinner />}
            {!incident && !loadingIncident && (
              <>
                <Alert
                  title="No hay incidencia asociada"
                  description="Esta revisión no está vinculada a ninguna incidencia."
                  color="primary"
                />
                <Button
                  color="primary"
                  onPress={handleCreateOpen}
                  radius="full"
                  size="sm"
                >
                  Crear incidencia
                </Button>
                <Dialog open={openCreateIncident} onClose={handleCreateClose} maxWidth="lg">
                  <CreateIncidentModal onClose={handleCreateClose} inspection_id={vehicleInspection.inspection?.id}></CreateIncidentModal>
                </Dialog>
              </>
            )}
            {incident && (
              <>
                <Button
                  color="primary"
                  onPress={handleOpen}
                  radius="full"
                  isDisabled={
                    vehicleInspection.inspection?.inspectionState === 'confirmed' || isEditing
                  }
                >
                  Editar incidencia
                </Button>
                <Dialog open={openEditIncident} onClose={handleClose} maxWidth="lg">
                  <EditIncidentModal onClose={handleClose} incident={incident} />
                </Dialog>

                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <p>
                    {incident.state}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Operador</p>
                  <p>
                    {incident.driver.name} ({incident.driver.license})
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehículo</p>
                  <p>
                    {incident?.vehicle
                      ? `${incident.vehicle.name} (${incident.vehicle.licensePlate})`
                      : 'No asignado'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reportado por</p>
                  <p>{incident?.user.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha de registro</p>
                  <p>{incident?.createdAt.format('DD/MM/YYYY hh:mm A')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Responsabilidad</p>
                  {incident?.isDriverResponsible ? (
                    <>
                      <ErrorOutline color="error" sx={{ fontSize: '1.2rem' }} />
                      <span className="text-red-600">Conductor responsable</span>
                    </>
                  ) : (
                    <>
                      <CheckCircleOutline
                        color="success"
                        sx={{ fontSize: '1.2rem' }}
                      />
                      <span className="text-green-600">
                        Conductor no responsable
                      </span>
                    </>
                  )}
                </div>
              </>
            )}
          </DetailCard>
        </div>

        {/* Evidencias */}
        <DetailCard title="Checklist de Revisión">
          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
            {loadingChecklist && <LoadingSpinner />}
            {!checklist && !loadingChecklist && (
              <Alert
                title="No hay checklist de revisión"
                description="Esta revisión no tiene checklist asociada."
                color="primary"
              />
            )}
            {checklist &&
              checklist.length > 0 &&
              checklist.map((item) => (
                <ChecklistItem key={item.id} item={item} />
              ))}
          </div>
        </DetailCard>
      </div>
    </MuiModal >
  );
};

interface DetailCardProps {
  title: string;
  children: ReactNode;
}

const DetailCard = ({ title, children }: DetailCardProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium text-gray-700 mb-2">{title}</h3>
      <Divider sx={{ my: 1 }} />
      <div className="space-y-3">{children}</div>
    </div>
  );
};

const ChecklistItem = ({ item }: { item: VehicleInspectionQuestion }) => {
  const { id, question, answer, questionType } = item;

  const isValidFileType =
    questionType === 'file' && Array.isArray(answer) && answer.length > 0;

  return (
    <div key={id} className="flex flex-col gap-2">
      <span>{question}</span>
      {questionType === 'boolean' && (
        <Chip
          sx={{
            textTransform: 'uppercase',
            width: '80px',
          }}
          label={answer as string}
          size="small"
          variant="outlined"
        />
      )}
      {isValidFileType && <FilesList files={answer} />}
    </div>
  );
};

