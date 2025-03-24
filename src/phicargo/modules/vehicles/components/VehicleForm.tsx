import { Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import { DriverSearchInput, SelectInput } from '@/components/inputs';
import { SubmitHandler, useForm } from 'react-hook-form';
import type { Vehicle, VehicleUpdate } from '../../vehicles/models';

import { SaveButton } from '@/components/ui';
import { useAuthContext } from '../../auth/hooks';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicleQueries } from '../../vehicles/hooks/queries';

const EDIT_VEHICLE_TYPE_PERMISSION = 206;

const initialState: VehicleUpdate = {
  companyId: null,
  branchId: null,
  stateId: null,
  driverId: null,
  vehicleType: null,
  modality: null,
  typeLoad: null,
};

interface Props {
  vehicle: Vehicle;
}

const VehicleForm = (props: Props) => {
  const { vehicle } = props;

  const { session } = useAuthContext();

  const { user } = session || {};

  const editVehicleType = !user?.permissions.includes(
    EDIT_VEHICLE_TYPE_PERMISSION,
  );

  const navigate = useNavigate();

  const {
    vehicleUpdateMutation: { mutate: updateVehicle, isPending },
  } = useVehicleQueries();

  const formData = useMemo(() => {
    if (!vehicle) {
      return initialState;
    }
    return transformVehicleToForm(vehicle);
  }, [vehicle]);

  const { control, handleSubmit, watch } = useForm<VehicleUpdate>({
    defaultValues: formData,
  });

  const stateId = watch('stateId');
  const driverId = watch('driverId');

  const onSubmit: SubmitHandler<VehicleUpdate> = (data) => {
    updateVehicle(
      {
        id: vehicle.id,
        updatedItem: data,
      },
      {
        onSettled: () => navigate('/disponibilidad/unidades'),
      },
    );
  };

  return (
    <Card
      classNames={{
        base: 'shadow-none',
        header: 'bg-gray-100 px-4 py-1',
        body: 'overflow-y-auto h-80',
      }}
      radius="md"
    >
      <CardHeader className="flex items-center justify-between">
        <h3 className="text-gray-800 font-bold text-lg">Datos de la Unidad</h3>
      </CardHeader>
      <CardBody>
        <form className="grid grid-cols-2 gap-4">
          <div className="mb-3">
            <SelectInput
              control={control}
              name="companyId"
              label="Empresa"
              items={[
                { key: 1, value: 'TRANSPORTES BELCHEZ' },
                { key: 2, value: 'PHI-CARGO' },
              ]}
            />
          </div>

          <div className="mb-3">
            <SelectInput
              control={control}
              name="branchId"
              label="Sucursal"
              items={[
                { key: 1, value: 'Veracruz' },
                { key: 9, value: 'Manzanillo' },
                { key: 2, value: 'México' },
              ]}
            />
          </div>

          <div className="mb-3">
            <SelectInput
              control={control}
              name="stateId"
              label="Estado"
              isDisabled={stateId === 5}
              disabledKeys={['5']}
              items={[
                { key: 1, value: 'EN USO' },
                { key: 2, value: 'BAJA POR VENTA' },
                { key: 3, value: 'BAJA POR PERDIDA TOTAL' },
                { key: 4, value: 'EN REPARACION POR SINIESTRO' },
                { key: 5, value: 'EN REPARACION POR FALLAS MECANICAS' },
                { key: 6, value: 'ESTATUS PGJ' },
                { key: 7, value: 'ESTATUS OCRA' },
                { key: 8, value: 'TERMINACION DE ARRENDAMIENTO' },
              ]}
            />
          </div>

          <div className="flex-1 mb-3">
            <DriverSearchInput
              control={control}
              name="driverId"
              driverId={driverId}
              required={false}
            />
          </div>

          <div className="mb-3">
            <SelectInput
              control={control}
              name="vehicleType"
              label="Tipo de vehiculo"
              isDisabled={editVehicleType}
              items={[
                { key: 'local', value: 'Local' },
                { key: 'carretera', value: 'Carretera' },
              ]}
            />
          </div>

          <div className="mb-3">
            <SelectInput
              control={control}
              name="modality"
              label="Modalidad"
              items={[
                { key: 'sencillo', value: 'Sencillo' },
                { key: 'full', value: 'Full' },
              ]}
            />
          </div>

          <div className="mb-3">
            <SelectInput
              control={control}
              name="typeLoad"
              label="Tipo de carga"
              items={[
                { key: 'imo', value: 'IMO' },
                { key: 'general', value: 'General' },
              ]}
            />
          </div>
        </form>
      </CardBody>
      <CardFooter className="pt-0">
        <SaveButton
          onClick={handleSubmit(onSubmit)}
          className="w-full uppercase"
          isLoading={isPending}
          variant="flat"
        />
      </CardFooter>
    </Card>
  );
};

export default VehicleForm;

const transformVehicleToForm = (vehicle: Vehicle): VehicleUpdate => ({
  companyId: vehicle.company?.id,
  branchId: vehicle.branch?.id,
  stateId: vehicle.state?.id,
  driverId: vehicle.driver?.id,
  vehicleType: vehicle.vehicleType,
  modality: vehicle.modality,
  typeLoad: vehicle.loadType,
});
