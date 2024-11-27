import { Chip } from '@nextui-org/react';
import { Driver } from '../models/driver-model';

interface Props {
  driver?: Driver;
}

const DriverModalHeader = (props: Props) => {
  const { driver } = props;

  return (
    <div>
      {driver ? (
        <div className="text-sm text-gray-700">
          <div className="grid grid-cols-2 gap-x-4">
            <p>
              <span className="font-semibold text-gray-900">Operador:</span>{' '}
              {driver.name}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Compañía:</span>{' '}
              {driver.company?.name}
            </p>
            <p>
              <span className="font-semibold text-gray-900">
                Tipo Licencia:
              </span>{' '}
              {driver.licenseType}
            </p>
            <p>
              <span className="font-semibold text-gray-900">No. Licencia:</span>{' '}
              {driver.licenseId}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Modalidad:</span>{' '}
              {driver.modality}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Puesto:</span>{' '}
              {driver.job.name}
            </p>
            <p className="col-span-2 flex items-center">
              <span className="font-semibold text-gray-900">Estatus:</span>
              <Chip className="ml-2" color="primary">
                {driver.status}
              </Chip>
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Cargando...</p>
      )}
    </div>
  );
};

export default DriverModalHeader;

