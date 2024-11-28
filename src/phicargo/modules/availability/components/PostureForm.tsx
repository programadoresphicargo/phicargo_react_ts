import { SelectInput } from '../../core/components/inputs/SelectInput';
import { TextInput } from '../../core/components/inputs/TextInput';
import { useForm } from 'react-hook-form';

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

const PostureForm = () => {
  const { control } = useForm<PostureCreate>({
    defaultValues: initialState,
  });

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
    </div>
  );
};

export default PostureForm;

