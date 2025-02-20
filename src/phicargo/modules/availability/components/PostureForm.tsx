import { SubmitHandler, useForm } from 'react-hook-form';

import { Button } from "@heroui/react";
import { SelectInput } from '../../core/components/inputs/SelectInput';
import { TextInput } from '../../core/components/inputs/TextInput';
import { Vehicle } from '../models/vehicle-model';

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
    <div>
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

      <Button onClick={handleSubmit(onSubmit)} type="submit">
        Guardar
      </Button>
    </div>
  );
};

export default PostureForm;

