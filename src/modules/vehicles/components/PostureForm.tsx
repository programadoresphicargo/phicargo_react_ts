import { Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import { SelectInput, TextInput } from '@/components/inputs';
import { SubmitHandler, useForm } from 'react-hook-form';

import { SaveButton } from '@/components/ui';
import type { Vehicle } from '../../vehicles/models';

interface PostureCreate {
  driverId: number;
  vehicleId: number;
  reason: string;
}

const initialState: PostureCreate = {
  driverId: '' as unknown as number,
  vehicleId: '' as unknown as number,
  reason: '',
};

interface Props {
  vehicle: Vehicle;
}

const PostureForm = (props: Props) => {
  const { vehicle } = props;

  const { control, handleSubmit } = useForm<PostureCreate>({
    defaultValues: initialState,
  });

  const onSubmit: SubmitHandler<PostureCreate> = (data) => {
    console.log(data, vehicle);
  };

  return (
    <Card
      classNames={{
        base: 'shadow-none',
        header: 'bg-gray-200 px-4 py-1',
        body: 'overflow-y-auto h-80',
      }}
      radius="md"
    >
      <CardHeader className="flex items-center justify-between">
        <h3 className="text-gray-800 font-bold text-lg">Posturas de la Unidad</h3>
      </CardHeader>
      <CardBody>
        <form className="grid grid-cols-2 gap-4">
          <SelectInput
            control={control}
            name="driverId"
            label="Operador postura"
            items={[
              { key: 1, value: 'TRANSPORTES BELCHEZ' },
              { key: 2, value: 'PHI-CARGO' },
            ]}
          />

          <TextInput
            control={control}
            name="reason"
            label="Motivo de postura"
            rules={{ required: 'Este campo es requerido' }}
          />
        </form>
      </CardBody>
      <CardFooter className="pt-0">
        <SaveButton
          onClick={handleSubmit(onSubmit)}
          className="w-full uppercase"
          // isLoading={isPending}
          variant="flat"
        />
      </CardFooter>
    </Card>
  );
};

export default PostureForm;

