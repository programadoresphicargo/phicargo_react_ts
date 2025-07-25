import { Button, Image } from '@heroui/react';
import { PasswordInput2, TextInput } from '@/components/inputs';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuthContext, useLoginMutation } from '../hooks';

import { Toaster } from 'react-hot-toast';
import { UserLogin } from '../models';
import logo from '@/assets/img/phicargo_logo_white.png';
import tractScania from '@/assets/img/tract_scannia.jpg';
import { useNavigate } from 'react-router-dom';

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
      <div
        className="flex h-screen"
        style={{ background: 'linear-gradient(90deg, #0b2149, #002887)' }}
      >
        <div className="relative w-3/5 h-full hidden lg:block">
          <img
            src={tractScania}
            alt="Tract Scania"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <h2 className="text-6xl font-extrabold text-transparent bg-clip-text text-white p-4 shadow-lg rounded-xl">
              Bienvenido 👋
            </h2>
          </div>
        </div>

        {/* Sección del formulario */}
        <div className="lg:p-36 md:p-52 sm:p-20 p-8 w-full lg:w-2/5 flex flex-col justify-center items-center">
          {/* Logo centrado */}
          <div className="flex justify-center mb-8">
            <Image width={300} alt="phicargo logo" src={logo} />
          </div>

          {/* Formulario */}
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
                placeholder="Username"
                rules={{ required: 'El usuario es requerido' }}
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
                label="Password"
                placeholder="Password"
                rules={{ required: 'La contraseña es requerida' }}
              />
            </div>
            <Button
              color="primary"
              className="w-full mb-4 bg-[#5e0e0d] font-bold uppercase text-sm transform transition-transform duration-300"
              type="submit"
              size="sm"
              isLoading={isPending}
            >
              Iniciar Sesión
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

