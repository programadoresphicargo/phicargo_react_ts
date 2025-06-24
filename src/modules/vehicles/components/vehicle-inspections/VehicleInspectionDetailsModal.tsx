import { Chip, Divider } from '@mui/material';
import { ReactNode } from 'react';
import { MuiModal } from '@/components';
import type {
  VehicleInspection,
  VehicleInspectionQuestion,
} from '../../models';
import { inspectionResult } from '../../utilities';
import { useGetDriverIncidentQuery } from '@/modules/incidents/hooks/quries';
import { CheckCircleOutline, ErrorOutline } from '@mui/icons-material';
import { Alert, LoadingSpinner } from '@/components/ui';
import { useGetInspectionChecklistQuery } from '../../hooks/queries';
import { FilesList } from '@/components/utils/FilesList';

interface Props {
  open: boolean;
  onClose: () => void;
  vehicleInspection: VehicleInspection;
}

export const VehicleInspectionDetailModal = ({
  open,
  onClose,
  vehicleInspection,
}: Props) => {
  const {
    query: { data: incident, isLoading: loadingIncident },
  } = useGetDriverIncidentQuery(vehicleInspection.inspection?.incidentId);

  const {
    query: { data: checklist, isLoading: loadingChecklist },
  } = useGetInspectionChecklistQuery(vehicleInspection.inspection?.id);

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
        {/* Sección de información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailCard title="Información de Revisión">
            <div>
              <p className="text-sm text-gray-500 uppercase">Resultado</p>
              {vehicleInspection.inspection?.result ? (
                <Chip
                  label={inspectionResult.getLabel(
                    vehicleInspection.inspection?.result,
                  )}
                  color={inspectionResult.getColor(
                    vehicleInspection.inspection?.result,
                  )}
                  size="small"
                />
              ) : (
                <Chip label="No Revisada" color="default" size="small" />
              )}
            </div>
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
              <p className="text-sm text-gray-500">Responsabilidad</p>
              <div className="flex items-center gap-1">
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
            </div>
            <div>
              <p className="text-sm text-gray-500">Comentarios</p>
              <div className="flex items-center gap-1">
                {vehicleInspection.inspection?.comments}
              </div>
            </div>
          </DetailCard>

          <DetailCard title="Incidencia Asociada">
            {loadingIncident && <LoadingSpinner />}
            {!incident && !loadingIncident && (
              <Alert
                title="No hay incidencia asociada"
                description="Esta revisión no está vinculada a ninguna incidencia."
                color="primary"
              />
            )}
            {incident && (
              <>
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
    </MuiModal>
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

