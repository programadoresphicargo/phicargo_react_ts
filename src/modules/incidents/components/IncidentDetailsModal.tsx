import { Chip, Divider } from '@mui/material';
import { ErrorOutline, CheckCircleOutline } from '@mui/icons-material';
import { ReactNode } from 'react';
import type { Incident } from '../models';
import { MuiModal } from '@/components';
import { incidentType } from '../utilities';
import { EvidencesList } from './EvidencesList';

interface Props {
  open: boolean;
  onClose: () => void;
  incident: Incident;
}

export const IncidentDetailsModal = ({ open, onClose, incident }: Props) => {
  return (
    <MuiModal
      open={open}
      onClose={onClose}
      maxWidth="md"
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="uppercase font-thin text-lg">
            Detalles: <span className="font-bold">{incident.driver.name}</span>
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
              <Chip
                label={incidentType.getLabel(incident.type)}
                color={incidentType.getColor(incident.type)}
                size="small"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">Fecha</p>
              <p>
                {incident.incidentDate?.format('DD/MM/YYYY') ||
                  'No especificada'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Responsabilidad</p>
              <div className="flex items-center gap-1">
                {incident.isDriverResponsible ? (
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
            </div>
          </DetailCard>

          <DetailCard title="Información del Operador">
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
          </DetailCard>
        </div>

        {/* Incidencia */}
        <DetailCard title="Incidencia">
          <p className="whitespace-pre-line uppercase">{incident.incident}</p>
        </DetailCard>

        {/* Comentarios */}
        {incident.comments && (
          <DetailCard title="Comentarios Adicionales">
            <p className="whitespace-pre-line uppercase">{incident.comments}</p>
          </DetailCard>
        )}

        {/* Evidencias */}
        <DetailCard title="Evidencias">
          {incident.evidences.length > 0 ? (
            <EvidencesList incident={incident} />
          ) : (
            <p className="text-gray-500 text-sm">No hay evidencias adjuntas</p>
          )}
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

