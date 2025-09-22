import { Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import {
  AutocompleteInput,
  CheckboxInput,
  EmailInput,
  PasswordInput2,
  TextInput,
} from '@/components/inputs';
import { SubmitHandler, useForm } from 'react-hook-form';

import type { FullUser } from '../../auth/models';
import { SaveButton } from '@/components/ui';
import type { UserUpdate } from '../models';
import { useEffect } from 'react';
import { useUsersQueries } from '../hooks/useUsersQueries';

const initialState: UserUpdate = {
  username: '',
  name: '',
  email: '',
  role: 'Invitado',
  isActive: true,
  password: '',
  pin: '',
};

interface Props {
  user?: FullUser;
}

const UserForm = (props: Props) => {
  const { user } = props;

  const { control, handleSubmit, reset } = useForm<UserUpdate>({
    defaultValues: user ? (user as unknown as UserUpdate) : initialState,
  });

  const {
    userUpdateMutattion: { mutate: updateUser, isPending },
  } = useUsersQueries();

  const onSubmit: SubmitHandler<UserUpdate> = (data) => {
    if (!user) {
      return;
    }
    updateUser({
      id: user?.id,
      updatedItem: data,
    });
  };

  useEffect(() => {
    if (user) {
      reset((user as unknown as UserUpdate));
    }
  }, [user, reset]);

  const roles = [
    { key: 'Sistema', value: 'Sistema' },
    { key: 'Desarrollador', value: 'Desarrollador' },
    { key: 'Vigilancia', value: 'Vigilancia' },
    { key: 'Administrador', value: 'Administrador' },
    { key: 'Invitado', value: 'Invitado' },
    { key: 'Supervisor', value: 'Supervisor' },
    { key: 'ejecutivo', value: 'ejecutivo' },
    { key: 'Contabilidad', value: 'Contabilidad' },
    { key: 'Dirección', value: 'Dirección' },
    { key: 'Monitorista', value: 'Monitorista' },
    { key: 'invitado', value: 'invitado' },
    { key: 'Ejecutivo', value: 'Ejecutivo' },
    { key: 'Almacenista', value: 'Almacenista' },
    { key: 'RH', value: 'RH' },
    { key: 'Comercial', value: 'Comercial' },
    { key: 'Legal', value: 'Legal' },
  ];

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
        <h3 className="text-gray-800 font-bold text-lg">Datos del Usuario</h3>
      </CardHeader>
      <CardBody>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              control={control}
              name="username"
              label="Usuario"
              rules={!user ? { required: 'Este campo es requerido' } : {}}
            />

            <TextInput
              control={control}
              name="name"
              label="Nombre"
              rules={!user ? { required: 'Este campo es requerido' } : {}}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PasswordInput2
              control={control}
              name="password"
              label="Contraseña"
              rules={!user ? { required: 'Este campo es requerido' } : {}}
            />

            <EmailInput
              control={control}
              name="email"
              label="Correo"
              rules={!user ? { required: 'Este campo es requerido' } : {}}
            />
          </div>

          <div className="flex items-center space-x-2">
            <PasswordInput2
              control={control}
              name="pin"
              label="Pin"
              rules={!user ? { required: 'Este campo es requerido' } : {}}
              className="w-1/3"
            />
            <AutocompleteInput control={control} name='role' items={roles} label="Especificar el tipo de usuario"></AutocompleteInput>
          </div>

          <div className="flex items-center space-x-2">
            <CheckboxInput control={control} name="isActive" label="Activo" />
          </div>

        </form>
      </CardBody>
      <CardFooter className="pt-0">
        <SaveButton
          onPress={() => handleSubmit(onSubmit)()}
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

export default UserForm;

