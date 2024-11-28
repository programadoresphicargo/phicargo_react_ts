import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Vehicle, VehicleUpdate } from '../models/vehicle-model';

import { Button } from '@nextui-org/react';
import { SelectInput } from '../../core/components/inputs/SelectInput';
import { useDriverQueries } from '../hooks/useDriverQueries';
import { useMemo } from 'react';
import { useVehicleQueries } from '../hooks/useVehicleQueries';

const initialState: VehicleUpdate = {
  companyId: null,
  branchId: null,
  stateId: null,
  driverId: null,
  vehicleType: null,
  modality: null,
  typeLoad: null,
};

const transformVehicleToForm = (vehicle: Vehicle): VehicleUpdate => ({
  companyId: vehicle.company?.id,
  branchId: vehicle.branch?.id,
  stateId: vehicle.state?.id,
  driverId: vehicle.driver?.id,
  vehicleType: vehicle.vehicleType,
  modality: vehicle.modality,
  typeLoad: vehicle.loadType,
});

const VehicleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { 
    vehicles,
    vehicleUpdateMutation: { mutate: updateVehicle, isPending }, 
  } = useVehicleQueries();
  const {
    driversQuery: { isFetching },
    AvailableDrivers,
  } = useDriverQueries();

  const vehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.id === Number(id)),
    [vehicles, id],
  );

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

  const onSubmit: SubmitHandler<VehicleUpdate> = (data) => {
    updateVehicle({
      id: Number(id),
      updatedItem: data,
    }, {
      onSettled: () => navigate('/disponibilidad/unidades'),
    });
  };

  if (!id) {
    return <Navigate to="/disponibilidad/unidades" />;
  }

  return (
    <form>
      <div className="row">
        <div className="col-4 mb-3">
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

        <div className="col-4 mb-3">
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

        <div className="col-4 mb-3">
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
              { key: 5, value: 'EN REPARACIÓN POR FALLAS MECÁNICAS' },
              { key: 6, value: 'ESTATUS PGJ' },
              { key: 7, value: 'ESTATUS OCRA' },
              { key: 8, value: 'TERMINACIÓN DE ARRENDAMIENTO' },
            ]}
          />
        </div>

        <div className="col-6 mb-3">
          <SelectInput
            control={control}
            isLoading={isFetching}
            name="driverId"
            label="Operador asignado"
            items={AvailableDrivers}
          />
        </div>

        <div className="col-6 mb-3">
          <SelectInput
            control={control}
            name="vehicleType"
            label="Tipo de vehiculo"
            items={[
              { key: 'local', value: 'Local' },
              { key: 'carretera', value: 'Carretera' },
            ]}
          />
        </div>

        <div className="col-6 mb-3">
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

        <div className="col-6 mb-3">
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
      </div>

      <div className="d-flex justify-content-end">
        <Button 
          color="primary" 
          onClick={handleSubmit(onSubmit)}
          isLoading={isPending}
        >
          Guardar
        </Button>
      </div>
    </form>
  );
};

export default VehicleForm;

