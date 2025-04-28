import { Chip } from '@mui/material';
import type { ComplaintAction } from '../models';
import { UpdateActionStatusOptions } from './complaint-edition/UpdateActionStatusOptions';
import { complaintActionStatus } from '../utilities';

interface Props {
  action: ComplaintAction;
}

export const ComplaintActionCard = ({ action }: Props) => {
  return (
    <>
      <div className="flex flex-row gap-3 p-3 mx-2 border rounded-md">
        <section className="flex flex-col gap-2">
          {/* Encabezado con responsable */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 uppercase">
              {action.responsible}{' '}
              <Chip
                label={complaintActionStatus.getLabel(action.status)}
                color={complaintActionStatus.getColor(action.status)}
                variant="outlined"
                size="small"
              />
            </h3>
            <span className="text-sm text-gray-500">
              Compromiso: {action.commitmentDate.format('DD/MM/YYYY')}
            </span>
          </div>

          {/* Plan de acción */}
          <p className="text-gray-700 whitespace-pre-wrap">
            {action.actionPlan}
          </p>

          {/* Información de creación */}
          <div className="text-xs text-gray-400">
            Creado por{' '}
            <span className="font-medium text-gray-500">
              {action.createdBy.name}
            </span>{' '}
            el {action.createdAt.format('DD/MM/YYYY')}
          </div>
        </section>
        <div className="ml-auto flex items-center">
          <UpdateActionStatusOptions actionId={action.id} />
        </div>
      </div>
    </>
  );
};

