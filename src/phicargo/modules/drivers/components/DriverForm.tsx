import { Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import {
  CheckboxInput,
  DatePickerInput,
  SelectInput,
  TextInput,
} from '@/components/inputs';
import type { Driver, DriverEdit } from '../models';
import { SubmitHandler, useForm } from 'react-hook-form';

import { SaveButton } from '@/components/ui';
import { useAuthContext } from '@/phicargo/modules/auth/hooks';
import { useDriverQueries } from '../hooks/queries';
import { useMemo } from 'react';

const EDIT_DRIVER_PERMISSION = 205;

const initialStateForm: DriverEdit = {
  licenseId: '',
  licenseType: '',
  jobId: undefined,
  modality: 'full',
  isDangerous: 'NO',
  isActive: true,
  hireDate: null,
};

interface Props {
  driver?: Driver;
}

const transformDriverToForm = (driver: Driver): DriverEdit => ({
  licenseId: driver.licenseId,
  licenseType: driver.licenseType,
  jobId: driver.job.id,
  modality: driver.modality,
  isDangerous: driver.isDangerous ? 'SI' : 'NO',
  isActive: driver.isActive,
  hireDate: driver.hireDate,
});

export const DriverForm = (props: Props) => {
  const { driver } = props;

  const { session } = useAuthContext();

  const { user } = session || {};

  const disabled = !user?.permissions.includes(EDIT_DRIVER_PERMISSION);

  const {
    driverUpdateMutattion: { mutate: updateDriver, isPending },
  } = useDriverQueries();

  const formData = useMemo(() => {
    if (!driver) {
      return initialStateForm;
    }
    return transformDriverToForm(driver);
  }, [driver]);

  const { control, handleSubmit } = useForm<DriverEdit>({
    defaultValues: formData,
  });

  const onSubmit: SubmitHandler<DriverEdit> = (data) => {
    if (!driver) return;
    updateDriver({ id: driver?.id, updatedItem: data });
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
        <h3 className="text-gray-800 font-bold text-lg">Datos del Operador</h3>
      </CardHeader>
      <CardBody>
        <form className="grid grid-cols-2 gap-4">
          <TextInput
            control={control}
            name="licenseId"
            label="No. Licencia"
            isDisabled={disabled}
          />
          <TextInput
            control={control}
            name="licenseType"
            label="Tipo Licencia"
            isDisabled={disabled}
          />

          <SelectInput
            control={control}
            name="jobId"
            label="Puesto"
            isDisabled={disabled}
            items={[
              { value: 'OPERADOR', key: 25 },
              { value: 'MOVEDOR', key: 26 },
              { value: 'OPERADOR POSTURERO', key: 55 },
            ]}
          />
          <SelectInput
            control={control}
            name="modality"
            label="Modalidad"
            isDisabled={disabled}
            items={[
              { value: 'FULL', key: 'full' },
              { value: 'SENCILLO', key: 'single' },
            ]}
          />

          <SelectInput
            control={control}
            name="isDangerous"
            label="Peligroso"
            isDisabled={disabled}
            items={[
              { value: 'SI', key: 'SI' },
              { value: 'NO', key: 'NO' },
            ]}
          />
          <DatePickerInput
            control={control}
            name="hireDate"
            label="Fecha de Ingreso"
            initialValue={formData.hireDate || undefined}
            isDisabled={disabled}
          />

          {/* Checkbox en una fila completa */}
          <div className="col-span-2 flex items-center">
            <CheckboxInput
              control={control}
              name="isActive"
              label="Activo"
              isDisabled={disabled}
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
        >
          Guardar
        </SaveButton>
      </CardFooter>
    </Card>
  );
};
