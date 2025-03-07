import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Driver } from '../../availability/models/driver-model';
import { PasswordInput } from '@/components/inputs/PasswordInput';
import { useChangeDriverPassword } from '../../drivers/hooks/queries';

type Password = {
  password: string | null;
}

interface Props {
  onClose: () => void;
  driver: Driver;
}

export const DriverAccountForm = ({ onClose, driver }: Props) => {
  const { control, handleSubmit } = useForm<Password>({
    defaultValues: { password: driver.password },
  });

  const { changeDriverPasswordMutation } = useChangeDriverPassword();

  const onSubmit: SubmitHandler<Password> = (data) => {
    changeDriverPasswordMutation.mutate(
      {
        driverId: driver.id,
        password: data.password!,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px 15px',
          color: 'white',
          textTransform: 'uppercase',
          background: 'linear-gradient(90deg, #0b2149, #002887)',
        }}
      >
        {'Cambiar Contraseña'}
      </DialogTitle>
      <DialogContent>
        <div className="mt-4">
          <p>
            <span>
              <strong>{'Operador: '}</strong>
            </span>
            <span>
              <strong>{driver.name}</strong>
            </span>
          </p>
        </div>
        <div className="flex flex-col gap-4 mt-5">
          <PasswordInput
            control={control}
            name="password"
            required
          />
        </div>
      </DialogContent>
      <DialogActions sx={{ padding: '0' }}>
        <div className="flex justify-between w-full px-6 pb-4">
          <Button
            onClick={onClose}
            variant="outlined"
            color="error"
            size="small"
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Guardar
          </Button>
        </div>
      </DialogActions>
    </>
  );
};

