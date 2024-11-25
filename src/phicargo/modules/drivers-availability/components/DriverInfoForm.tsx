import { Button, Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react';
import { Driver, DriverEdit } from '../models/driver-model';
import { SubmitHandler, useForm } from 'react-hook-form';

import { SelectInput } from './inputs/SelectInput';
import { TextInput } from './inputs/TextInput';
import { useDriverQueries } from '../hooks/useDriverQueries';

const initialStateForm: DriverEdit = {
  driverLicenseId: '',
  driverLicenseType: '',
  jobId: undefined,
  modality: 'full',
  isDangerous: 'NO',
};

interface Props {
  driver?: Driver;
}

const disabled = false;

const DriverInfoForm = (props: Props) => {
  const { driver } = props;

  const { control, handleSubmit } = useForm<DriverEdit>({
    defaultValues: driver ? (driver as DriverEdit) : initialStateForm,
  });

  const {
    driverUpdateMutattion: { mutate: updateDriver, isPending },
  } = useDriverQueries();

  const onSubmit: SubmitHandler<DriverEdit> = (data) => {
    if (!driver) return;
    console.log(data);
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
            name="driverLicenseId"
            label="No. Licencia"
            isDisabled={disabled}
            />
          <TextInput
            control={control}
            name="driverLicenseType"
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
