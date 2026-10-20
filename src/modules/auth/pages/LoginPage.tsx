
import { useState } from 'react';
import { Button, Image } from '@heroui/react';
import { motion } from 'framer-motion';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { TextInput, PasswordInput2 } from '@/components/inputs';
import { useAuthContext, useLoginMutation } from '../hooks';
import { UserLogin } from '../models';

import logo from '@/assets/img/phicargo_logo_white.png';
import fondo from '@/assets/img/tract_scannia.jpg';

import './styles.css';

const initialForm: UserLogin = {
  username: '',
  password: '',
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { redirectTo } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);

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
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#10284d',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.12)',
          },
        }}
      />

      <main
        className="login-page relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6"
        style={{ backgroundImage: `url(${fondo})` }}
      >
        {/* Capa para integrar la fotografía con la paleta corporativa */}
        <div className="login-overlay absolute inset-0" />

        {/* Iluminación ambiental */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 -top-32 size-[420px] rounded-full bg-blue-500/20 blur-[130px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -right-20 size-[460px] rounded-full bg-cyan-400/10 blur-[140px]"
        />

        <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_440px] lg:gap-20">
          {/* Presentación corporativa: se oculta en móviles pequeños */}
          <motion.section
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="hidden text-white lg:block"
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 backdrop-blur-xl">
              <span className="size-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.8)]" />
              <span className="text-xs font-medium tracking-[0.16em] text-blue-50/90">
                PHI-CARGO APP
              </span>
            </div>

            <h1 className="max-w-xl text-5xl font-semibold leading-[1.12] tracking-tight xl:text-6xl">
              Phi-Cargo
              <span className="mt-2 block text-blue-200">
                Conciencia en transporte.
              </span>
            </h1>

            <div className="mt-10 flex items-center gap-3 text-sm text-white/70">
              <div className="flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl">
                <ShieldCheck size={20} strokeWidth={1.7} />
              </div>
              <div>
                <p className="font-medium text-white/90">
                  Bienvenido
                </p>
                <p className="mt-0.5 text-xs text-blue-100/60">
                  Plataforma para empleados
                </p>
              </div>
            </div>
          </motion.section>

          {/* Formulario */}
          <motion.section
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="login-card w-full rounded-[28px] p-6 shadow-2xl sm:p-9"
          >
            <div className="mb-8 flex flex-col items-center">
              <Image
                width={240}
                alt="Phi Cargo"
                src={logo}
                className="mb-7 max-h-24 object-contain"
              />

              <div className="mb-3 flex size-12 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.08] text-blue-100">
                <LockKeyhole size={22} strokeWidth={1.7} />
              </div>

              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Bienvenido
              </h2>

              <p className="mt-2 text-center text-sm leading-6 text-blue-100/65">
                Ingresa tus credenciales para continuar
              </p>
            </div>

            <form
              className="flex w-full flex-col gap-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="login-field">
                <TextInput
                  control={control}
                  name="username"
                  label="Usuario"
                  placeholder="Ingresa tu usuario"
                  rules={{ required: 'El usuario es requerido' }}
                  className="text-white"
                />
              </div>

              <div className="login-field relative">
                <PasswordInput2
                  control={control}
                  name="password"
                  label="Contraseña"
                  placeholder="Ingresa tu contraseña"
                  rules={{ required: 'La contraseña es requerida' }}
                  className="text-white"
                />
              </div>

              <Button
                className="login-submit mt-2 h-12 w-full rounded-xl text-sm font-semibold text-white"
                color="primary"
                type="submit"
                isLoading={isPending}
                isDisabled={isPending}
              >
                {isPending ? 'Verificando acceso...' : 'Iniciar sesión'}
              </Button>
            </form>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
                Phi Cargo
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <p className="text-center text-xs leading-5 text-blue-100/50">
              Sistema de acceso para empleados.
            </p>
          </motion.section>
        </div>

        <footer className="absolute bottom-4 left-0 right-0 z-10 px-4 text-center">
          <p className="text-[10px] tracking-wide text-white/45">
            PHI CARGO · {new Date().getFullYear()} · Todos los derechos reservados
          </p>
        </footer>
      </main>
    </>
  );
};

export default LoginPage;
