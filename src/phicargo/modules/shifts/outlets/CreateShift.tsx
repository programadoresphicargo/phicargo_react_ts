import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { SubmitHandler, useForm } from 'react-hook-form';

import { DatePickerInput } from '../../core/components/inputs/DatePickerInput';
import { DriverSearchInput } from '../../core/components/inputs/DriverSearchInput';
import { FaRegSave } from 'react-icons/fa';
import { SelectInput } from '../../core/components/inputs/SelectInput';
import type { ShiftCreate } from '../models';
import { TextareaInput } from '../../core/components/inputs/TextareaInput';
import { VehicleSearchInput } from '../../core/components/inputs/VehicleSearchInput';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useShiftQueries } from '../hooks/useShiftQueries';
import { useShiftsContext } from '../hooks/useShiftsContext';

const initialValues: ShiftCreate = {
  branchId: 0,
  vehicleId: null as unknown as number,
  driverId: null as unknown as number,
  arrivalAt: dayjs(),
  comments: '',
  maneuver1: null,
  maneuver2: null,
};

const CreateShift = () => {
  const navigate = useNavigate();

  const { control, handleSubmit, watch } = useForm<ShiftCreate>({
    defaultValues: initialValues,
  });

  const { branchId } = useShiftsContext();

  const { createShift } = useShiftQueries();

  const driverId = watch('driverId');
  const vehicleId = watch('vehicleId');

  const onSubmit: SubmitHandler<ShiftCreate> = (data) => {
    createShift.mutate(
      {
        ...data,
        branchId: branchId,
      },
      {
        onSuccess: () => {
          navigate('/turnos');
        },
      },
    );
  };

  const onClose = () => {
    navigate('/turnos');
  };

  return (
    <Modal isOpen={true} onOpenChange={onClose} size="lg">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex items-center justify-center bg-[#dadfeb] pb-2">
              <h3 className="font-bold text-xl text-center text-gray-800 uppercase">
                Crear Turno
              </h3>
            </ModalHeader>
            <ModalBody className="p-2">
              <div className="flex flex-col gap-4 border-2 rounded-lg p-3">
                <VehicleSearchInput
                  control={control}
                  name="vehicleId"
                  vehicleId={vehicleId}
                  required
                />
                <DriverSearchInput
                  control={control}
                  name="driverId"
                  driverId={driverId}
                  required
                />
                <DatePickerInput
                  control={control}
                  name="arrivalAt"
                  label="Fecha de llegada"
                  initialValue={initialValues.arrivalAt}
                  rules={{ required: 'Este campo es requerido' }}
                />
                <div className="flex gap-4">
                  <SelectInput
                    control={control}
                    name="maneuver1"
                    label="Maniobra 1"
                    items={[
                      { key: 'IMPORTACIÓN', value: 'IMPORTACIÓN' },
                      { key: 'EXPORTACIÓN', value: 'EXPORTACIÓN' },
                      { key: 'VACIO', value: 'VACIO' },
                    ]}
                  />
                  <SelectInput
                    control={control}
                    name="maneuver2"
                    label="Maniobra 2"
                    items={[
                      { key: 'IMPORTACIÓN', value: 'IMPORTACIÓN' },
                      { key: 'EXPORTACIÓN', value: 'EXPORTACIÓN' },
                      { key: 'VACIO', value: 'VACIO' },
                    ]}
                  />
                </div>
                <TextareaInput
                  control={control}
                  name="comments"
                  label="Comentarios"
                  isUpperCase
                  minRows={6}
                />
              </div>
              <Button
                onPress={() => handleSubmit(onSubmit)()}
                className="w-full mt-4"
                color="primary"
                startContent={<FaRegSave />}
                isLoading={createShift.isPending}
              >
                Guardar
              </Button>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateShift;

