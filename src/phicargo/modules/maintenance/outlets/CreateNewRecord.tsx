import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMaintenanceRecord, useVehicles, useWorkshop } from '../hooks';
import { useMemo, useState } from 'react';

import AddButton from '../../core/components/ui/AddButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddWorkshop from '../components/AddWorkshop';
import { DatePickerInput } from '../../core/components/inputs/DatePickerInput';
import { Dayjs } from 'dayjs';
import type { MaintenanceRecordCreate } from '../models';
import { SelectInput } from '../../core/components/inputs/SelectInput';
import { TextInput } from '../../core/components/inputs/TextInput';
import { TextareaInput } from '../../core/components/inputs/TextareaInput';
import { Tooltip } from '@mui/material';
import { VehicleSearchInput } from '../../core/components/inputs/VehicleSearchInput';
import { useNavigate } from 'react-router-dom';

const initialFormState: MaintenanceRecordCreate = {
  workshopId: '' as unknown as number,
  failType: 'MC',
  checkIn: null as unknown as Dayjs,
  status: 'pending',
  deliveryDate: null as unknown as Dayjs,
  supervisor: '',
  comments: '',
  order: '',
  vehicleId: '' as unknown as number,
};

const CreateNewRecord = () => {
  const navigate = useNavigate();
  const [addWorkshop, setAddWorkshop] = useState(false);

  const {
    vehicleQuery: { data: vehicles },
  } = useVehicles();

  const {
    workshopQuery: { data: workshops, isFetching: loadingWorkshops },
  } = useWorkshop();

  const {
    addRecordMutation: { mutate: addRegister, isPending },
  } = useMaintenanceRecord();

  const { control, handleSubmit, watch } = useForm<MaintenanceRecordCreate>({
    defaultValues: initialFormState,
  });

  const vehicleId = watch('vehicleId');

  const vehicle = useMemo(
    () => vehicles?.find((t) => t.id === vehicleId),
    [vehicleId, vehicles],
  );

  const onSubmit: SubmitHandler<MaintenanceRecordCreate> = (data) => {
    addRegister(data);
  };

  const onClose = () => {
    navigate('/reportes/mantenimiento');
  };

  return (
    <>
      <Modal isOpen={true} size={'xl'} onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col pb-2 bg-[#dadfeb]">
                <h3 className="font-bold text-xl text-center text-gray-800 uppercase">
                  Crear Nuevo Registro
                </h3>
              </ModalHeader>
              <ModalBody className="overflow-hidden">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <VehicleSearchInput
                        control={control}
                        name="vehicleId"
                        label="Vehículo"
                        required
                        vehicleId={vehicleId}
                        isDisabled={false}
                      />
                    </div>
                    {vehicle && (
                      <div className="mt-2">
                        <p className="font-semibold">
                          Tipo: {vehicle?.vehicleType}
                        </p>
                        <p className="font-semibold">
                          Sucursal: {vehicle?.branch?.name}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <SelectInput
                        control={control}
                        label="Tipo de Falla"
                        name="failType"
                        items={[
                          { key: 'MC', value: 'Mecánica' },
                          { key: 'EL', value: 'Eléctrica' },
                        ]}
                        rules={{ required: 'Este campo es requerido' }}
                      />
                    </div>
                    <div>
                      <SelectInput
                        control={control}
                        label="Supervisor"
                        name="supervisor"
                        items={[
                          {
                            key: 'CONTRERAS HERNANDEZ ANDRES',
                            value: 'CONTRERAS HERNANDEZ ANDRES',
                          },
                          {
                            key: 'DE LA PARRA TRUJILLO SERGIO',
                            value: 'DE LA PARRA TRUJILLO SERGIO',
                          },
                          {
                            key: 'ORTIZ DIAZ CARLOS EDUARDO',
                            value: 'ORTIZ DIAZ CARLOS EDUARDO',
                          },
                        ]}
                        rules={{ required: 'Este campo es requerido' }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <DatePickerInput
                        control={control}
                        name="checkIn"
                        label="Fecha de Ingreso"
                        rules={{ required: 'Este campo es requerido' }}
                      />
                    </div>
                    <div>
                      <DatePickerInput
                        control={control}
                        name="deliveryDate"
                        label="Fecha tentativa de entrega"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-row">
                      <SelectInput
                        control={control}
                        name="workshopId"
                        label="Taller"
                        isLoading={loadingWorkshops}
                        items={(workshops || []).map((w) => ({
                          key: w.id,
                          value: w.name,
                        }))}
                        rules={{ required: 'Este campo es requerido' }}
                      />
                      <Tooltip title="Agregar Taller" placement="top-start">
                        <button
                          type="button"
                          onClick={() => setAddWorkshop(true)}
                          className="ml-2 text-blue-500 hover:text-blue-700"
                        >
                          <AddCircleOutlineIcon />
                        </button>
                      </Tooltip>
                    </div>
                    <div>
                      <TextInput
                        control={control}
                        name="order"
                        label="Orden de Servicio"
                        isUpperCase
                        rules={{ required: 'Este campo es requerido' }}
                      />
                    </div>
                  </div>

                  <div>
                    <TextareaInput
                      control={control}
                      name="comments"
                      label="Comentarios de Falla"
                      isUpperCase
                      className="w-full"
                      rules={{ required: 'Este campo es requerido' }}
                    />
                  </div>
                </form>
              </ModalBody>

              <ModalFooter>
                <AddButton
                  label="Crear"
                  onClick={handleSubmit(onSubmit)}
                  isLoading={isPending}
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {addWorkshop && <AddWorkshop onClose={() => setAddWorkshop(false)} />}
    </>
  );
};

export default CreateNewRecord;
