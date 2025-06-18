import { Chip, Divider } from '@mui/material';
import { ReactNode } from 'react';
import { MuiModal } from '@/components';
import type { VehicleInspection } from '../../models';
import { inspectionResult } from '../../utilities';

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
  return (
    <MuiModal
      open={open}
      onClose={onClose}
      maxWidth="md"
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="uppercase font-thin text-lg">
            Detalles:{' '}
            <span className="font-bold">{vehicleInspection.driver?.name}</span>
          </h2>
        </div>
      }
    >
      <div className="flex flex-col gap-4 p-4">
        {/* Sección de información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailCard title="Información de Incidencia">
            <div>
              <p className="text-sm text-gray-500 uppercase">Tipo</p>
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
              <p className="text-sm text-gray-500 uppercase">Fecha</p>
              <p>
                {vehicleInspection.inspection?.inspectionDate?.format(
                  'DD/MM/YYYY',
                ) || 'No especificada'}
              </p>
            </div>
            {/* <div>
              <p className="text-sm text-gray-500">Responsabilidad</p>
              <div className="flex items-center gap-1">
                {vehicleInspection.inspection?.isDriverResponsible ? (
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
              <p className="text-sm text-gray-500">Costo de daños</p>
              <p>
                {incident.damageCost
                  ? `$${incident.damageCost.toLocaleString()}`
                  : 'No especificado'}
              </p>
            </div> */}
          </DetailCard>

          {/* <DetailCard title="Información del Operador">
            <div>
              <p className="text-sm text-gray-500">Operador</p>
              <p>
                {incident.driver.name} ({incident.driver.license})
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Vehículo</p>
              <p>
                {incident.vehicle
                  ? `${incident.vehicle.name} (${incident.vehicle.licensePlate})`
                  : 'No asignado'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Reportado por</p>
              <p>{incident.user.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha de registro</p>
              <p>{incident.createdAt.format('DD/MM/YYYY hh:mm A')}</p>
            </div>
          </DetailCard> */}
        </div>

        {/* Comentarios */}
        {vehicleInspection.inspection?.comments && (
          <DetailCard title="Comentarios Adicionales">
            <p className="whitespace-pre-line uppercase">
              {vehicleInspection.inspection?.comments}
            </p>
          </DetailCard>
        )}

        {/* Evidencias */}
        {/* <DetailCard title="Evidencias">
          {incident.evidences.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {incident.evidences.map((evidence) => (
                <div
                  key={evidence.idOnedrive}
                  className="border rounded-md p-1 flex flex-col items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="relative w-full">
                    <div className="w-6 h-6 mx-auto flex items-center justify-center bg-gray-100 rounded">
                      <span className="text-[0.6rem] text-gray-500 font-medium">
                        {evidence.filename
                          .split('.')
                          .pop()
                          ?.slice(0, 3)
                          .toUpperCase()}
                      </span>
                    </div>

                    <div className="absolute top-0 right-0">
                      {loadingEvidences[evidence.idOnedrive] ? (
                        <CircularProgress size={14} />
                      ) : errorEvidences[evidence.idOnedrive] ? (
                        <ErrorOutline color="error" fontSize="small" />
                      ) : null}
                    </div>
                  </div>

                  <Tooltip title={evidence.filename} placement="bottom">
                    <p className="text-[0.65rem] text-center truncate w-full mt-1 px-1">
                      {evidence.filename.split('.')[0]}
                    </p>
                  </Tooltip>

                  <IconButton
                    size="small"
                    className="text-xs mt-0.5"
                    onClick={() => handleViewEvidence(evidence.idOnedrive)}
                    disabled={loadingEvidences[evidence.idOnedrive]}
                  >
                    <Download fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No hay evidencias adjuntas</p>
          )}
        </DetailCard> */}
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

