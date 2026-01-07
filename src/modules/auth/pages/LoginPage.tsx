import { Button, Image } from '@heroui/react';
import { PasswordInput2, TextInput } from '@/components/inputs';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuthContext, useLoginMutation } from '../hooks';
import { Toaster } from 'react-hot-toast';
import { UserLogin } from '../models';
import logo from '@/assets/img/phicargo_logo_white.png';
import { useNavigate } from 'react-router-dom';
import navidad from '@/assets/original/magos2.png';
import Snowfall from 'react-snowfall';
import './styles.css';

const initialForm: UserLogin = {
  username: '',
  password: '',
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { redirectTo } = useAuthContext();

  const { control, handleSubmit } = useForm<UserLogin>({
    defaultValues: initialForm,
  });

  const {
    loginMutation: { mutate: login, isPending },
  } = useLoginMutation();

  const onSubmit: SubmitHandler<UserLogin> = (data) => {
    login(data, {
      onSuccess: () => {
        navigate(redirectTo || '/');
      },
    });
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg_fondo">
        <div className="bg_login"></div>
        <div className="bg_login bg2_login"></div>
        <div className="bg_login bg3_login"></div>

        <div className="content_login">
          <div className="flex h-full w-full items-center justify-center">
            <div className="glass flex w-full max-w-sm flex-col gap-10 px-8 pb-10 pt-6 shadow-small">
              <div className="flex flex-col gap-1">

                <div className="flex justify-center mb-5">
                  <Image width={400} alt="phicargo logo" src={logo} />
                </div>

                <h1 className="text-large font-medium text-white">Bienvenido 👋</h1>
                <p className="text-small text-default-500 text-white">Inicia sesión en tu cuenta para ingresar</p>
              </div>

              <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-6">
                  <TextInput
                    control={control}
                    // className="h-9"
                    // classNames={{
                    //   label: 'text-xs',
                    //   innerWrapper: 'bg-red',
                    // }}
                    name="username"
                    label="Usuario"
                    placeholder="Ingresa tu nombre de usuario"
                    rules={{ required: 'El usuario es requerido' }}
                    className='text-white'
                  />
                </div>
                <div className="mb-6">
                  <PasswordInput2
                    // className="h-9"
                    // classNames={{
                    //   label: 'text-xs',
                    // }}
                    control={control}
                    name="password"
                    label="Contraseña"
                    placeholder="Password"
                    rules={{ required: 'La contraseña es requerida' }}
                    className='text-white'
                  />
                </div>

                <Button
                  className="w-full text-white"
                  color="primary"
                  type="submit"
                  size="sm"
                  isLoading={isPending}
                >
                  Iniciar Sesión
                </Button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

