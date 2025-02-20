import { Button, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { Driver, DriverEdit } from '../models/driver-model';
import { SubmitHandler, useForm } from 'react-hook-form';

import { CheckboxInput } from '../../core/components/inputs/CheckboxInput';
import { DatePickerInput } from '../../core/components/inputs/DatePickerInput';
import { SelectInput } from '../../core/components/inputs/SelectInput';
import { TextInput } from '../../core/components/inputs/TextInput';
import { useDriverQueries } from '../hooks/useDriverQueries';
import { useMemo } from 'react';

const initialStateForm: DriverEdit = {
  licenseId: '',
  licenseType: '',
  jobId: undefined,
  modality: 'full',
  isDangerous: 'NO',
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

const disabled = false;

const DriverInfoForm = (props: Props) => {
  const { driver } = props;

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
    <Card>
      <CardHeader className='bg-gray-100'>
        <h3 className="font-bold text-center">Información del Conductor</h3>
      </CardHeader>
      <CardBody>
        <form className="flex flex-col gap-2">
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
          <CheckboxInput 
            control={control}
            name="isActive"
            label="Activo"
            isDisabled={disabled}
          />
        </form>
      </CardBody>
      <CardFooter className='pt-0'>
        <Button
          color="primary"
          onClick={handleSubmit(onSubmit)}
          size='sm'
          className='w-full uppercase'
          isLoading={isPending}
        >
          Guardar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DriverInfoForm;
