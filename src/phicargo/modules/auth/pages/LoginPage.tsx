import { Button, Image } from '@nextui-org/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuthContext, useLoginMutation } from '../hooks';

import { PasswordInput } from '../../core/components/inputs/PasswordInput';
import { TextInput } from '../../core/components/inputs/TextInput';
import { Toaster } from 'react-hot-toast';
import { UserLogin } from '../models';
import logo from '../../../../assets/img/phicargo_logo_white.png';
import tractScania from '../../../../assets/img/tract_scannia.jpg';
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
      }
    });
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-[#17566d] flex h-screen">
        <div className="relative w-3/5 h-full hidden lg:block">
          <img
            src={tractScania}
            alt="Tract Scania"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <h2 className="text-6xl font-extrabold text-transparent bg-clip-text text-white p-4 shadow-lg rounded-xl">
              Bienvenido
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
                name="username"
                label="Usuario"
                placeholder="Username"
                rules={{ required: 'El usuario es requerido' }}
              />
            </div>
            <div className="mb-6">
              <PasswordInput
                control={control}
                name="password"
                label="Password"
                placeholder="Password"
                rules={{ required: 'La contraseña es requerida' }}
              />
            </div>
            <Button
              color="primary"
              className="w-full mb-4  bg-[#5e0e0d] font-bold uppercase text-medium transform transition-transform duration-300 hover:scale-105"
              type="submit"
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

