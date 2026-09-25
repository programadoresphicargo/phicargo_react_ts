import {
  Card,
  CardBody,
  CardFooter,
  Spinner,
} from '@heroui/react';
import {
  AutocompleteInput,
  DatePickerInput,
  DriverSearchInput,
  TextInput,
} from '@/components/inputs';
import type { Postura, PosturaCreate } from '../models';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Dayjs } from 'dayjs';
import {
  useCreatePosturaMutation,
  useFinishPosturaMutation,
} from '../hooks/mutations';

import { AlertDialog } from '@/components';
import { FaCalendarMinus } from 'react-icons/fa';
import { IoMdExit } from 'react-icons/io';
import { SaveButton } from '@/components/ui';
import { useGetPosturasByVehicleQuery } from '../hooks/queries';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import odooApi from '@/api/odoo-api';
import { SelectItem } from '@/types';
import { Flota } from '@/phicargo/maniobras/maniobras/tipado';

const initialState: PosturaCreate = {
  vehicleId: null as unknown as number,
  driverId: null as unknown as number,
  reason: '',
  startDate: null as unknown as Dayjs,
  endDate: null as unknown as Dayjs,
  finished: false,
};

interface Props {
  open: boolean;
  handleClose: () => void;
}

export const PosturasForm = ({
  open,
  handleClose,
}: Props) => {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    watch,
  } = useForm<PosturaCreate>({
    defaultValues: initialState,
  });

  const vehicle_id = watch('vehicleId');
  const driverId = watch('driverId');

  const [itemSelected, setItemSelected] =
    useState<Postura | null>(null);

  const [tractores, setTractores] =
    useState<SelectItem[]>([]);

  const {
    getPosturasByVehicleQuery,
  } = useGetPosturasByVehicleQuery(
    vehicle_id ?? 0,
  );

  const {
    createPosturaMutation,
  } = useCreatePosturaMutation();

  const {
    finishPosturaMutation,
  } = useFinishPosturaMutation();

  const onSubmit: SubmitHandler<PosturaCreate> = (data) => {
    if (createPosturaMutation.isPending) return;
    if (!vehicle_id) return;

    createPosturaMutation.mutate(
      {
        vehicleId: vehicle_id,
        data,
      },
      {
        onSuccess: () => {
          reset(initialState);
        },
      },
    );
  };

  const onFinishPostura = (posturaId: number) => {
    if (finishPosturaMutation.isPending) return;

    finishPosturaMutation.mutate(posturaId, {
      onSuccess: () => {
        setItemSelected(null);

        queryClient.invalidateQueries({
          queryKey: [
            'posturas-vehicle',
            vehicle_id,
          ],
        });
      },
    });
  };

  const getTractos = async (
    tipo: string,
  ): Promise<SelectItem[]> => {
    const response = await odooApi.get<Flota[]>(
      `/vehicles/fleet_type/${tipo}`,
    );

    const options = response.data.map((item) => ({
      key: item.id,
      label: item.name,
      value: item.name,
      x_tipo_carga: item.x_tipo_carga,
      x_modalidad: item.x_modalidad,
    }));

    setTractores(options);

    return options;
  };

  useEffect(() => {
    getTractos('tractor');
  }, []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow:
            '0 20px 50px rgba(15, 23, 42, 0.15)',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        className="border-b border-slate-200 bg-white px-6 py-4"
        sx={{
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#002887]/10">
              <i className="bi bi-calendar2-x-fill text-lg text-[#002887]" />
            </div>

            <div>
              <h2
                className="text-base font-semibold text-slate-800"
                style={{
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Posturas
              </h2>

              <p
                className="text-xs text-slate-500"
                style={{
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Registra y consulta las posturas de las unidades
              </p>
            </div>
          </div>

          <div className="hidden rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 sm:block">
            <div className="flex items-center gap-2">
              <i className="bi bi-truck text-sm text-slate-500" />

              <span
                className="text-xs font-medium text-slate-600"
                style={{
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Gestión de posturas
              </span>
            </div>
          </div>
        </div>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        className="bg-[#f8fafc] px-6 py-5 mt-5"
        sx={{
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

          {/* Formulario */}
          <Card
            radius="lg"
            className="border border-slate-200 bg-white shadow-sm"
          >
            <CardBody className="p-5">
              <div className="mb-5 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#002887]/10">
                    <i className="bi bi-pencil-square text-sm text-[#002887]" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Registrar postura
                    </h3>

                    <p className="text-xs text-slate-500">
                      Captura la información correspondiente
                    </p>
                  </div>
                </div>
              </div>

              <form className="flex flex-col gap-4">
                <AutocompleteInput
                  control={control}
                  label="Vehículo"
                  name="vehicleId"
                  items={tractores}
                  size="sm"
                  rules={{
                    required: 'Campo obligatorio',
                  }}
                />

                <DriverSearchInput
                  control={control}
                  name="driverId"
                  driverId={driverId}
                  required
                />

                <TextInput
                  control={control}
                  name="reason"
                  label="Motivo de postura"
                  variant="flat"
                  rules={{
                    required: 'Este campo es requerido',
                  }}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <DatePickerInput
                    control={control}
                    name="startDate"
                    label="Fecha de inicio"
                    rules={{
                      required: 'Este campo es requerido',
                    }}
                  />

                  <DatePickerInput
                    control={control}
                    name="endDate"
                    label="Fecha fin"
                    rules={{
                      required: 'Este campo es requerido',
                    }}
                  />
                </div>
              </form>
            </CardBody>

            <CardFooter className="border-t border-slate-100 bg-slate-50/50 p-4">
              <SaveButton
                onPress={() =>
                  handleSubmit(onSubmit)()
                }
                className="w-full"
                isLoading={
                  createPosturaMutation.isPending
                }
              />
            </CardFooter>
          </Card>

          {/* Historial */}
          <Card
            radius="lg"
            className="border border-slate-200 bg-white shadow-sm"
          >
            <CardBody className="p-5">
              <div className="mb-5 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                      <i className="bi bi-clock-history text-sm text-slate-600" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        Historial de posturas
                      </h3>

                      <p className="text-xs text-slate-500">
                        Posturas registradas para el vehículo
                      </p>
                    </div>
                  </div>

                  {vehicle_id && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                      {getPosturasByVehicleQuery.data?.length ?? 0}{' '}
                      registros
                    </span>
                  )}
                </div>
              </div>

              <div className="max-h-[440px] overflow-y-auto pr-2">
                {!vehicle_id ? (
                  <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                      <i className="bi bi-truck text-xl text-slate-400" />
                    </div>

                    <p className="text-sm font-medium text-slate-700">
                      Selecciona un vehículo
                    </p>

                    <p className="mt-1 max-w-xs text-xs text-slate-500">
                      Selecciona una unidad para consultar
                      sus posturas registradas.
                    </p>
                  </div>
                ) : getPosturasByVehicleQuery.isLoading ? (
                  <div className="flex min-h-[300px] items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <Spinner size="sm" />

                      <span className="text-xs text-slate-500">
                        Cargando historial...
                      </span>
                    </div>
                  </div>
                ) : !getPosturasByVehicleQuery.data?.length ? (
                  <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                      <i className="bi bi-calendar-x text-xl text-slate-400" />
                    </div>

                    <p className="text-sm font-medium text-slate-700">
                      Sin posturas registradas
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Esta unidad no cuenta con posturas registradas.
                    </p>
                  </div>
                ) : (
                  <ol className="relative border-s border-slate-200">
                    {getPosturasByVehicleQuery.data.map(
                      (item) => (
                        <li
                          key={item.id}
                          className="relative mb-8 ms-6 last:mb-2"
                        >
                          <span className="absolute -start-[13px] flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-[#002887]/10">
                            <FaCalendarMinus className="h-2.5 w-2.5 text-[#002887]" />
                          </span>

                          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                            <div className="mb-2 flex items-start justify-between gap-3">
                              <div>
                                <h4 className="text-sm font-semibold text-slate-800">
                                  {item.driver}
                                </h4>

                                <span
                                  className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${item.finished
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-amber-50 text-amber-700'
                                    }`}
                                >
                                  {item.finished
                                    ? 'Finalizada'
                                    : 'Activa'}
                                </span>
                              </div>

                              <AlertDialog
                                title="Terminar Postura"
                                message="¿Está seguro que desea terminar la postura?"
                                onConfirm={() =>
                                  onFinishPostura(item.id)
                                }
                                iconOnly
                                onOpenChange={(isOpen) =>
                                  setItemSelected(
                                    isOpen ? item : null,
                                  )
                                }
                                open={
                                  itemSelected?.id === item.id
                                }
                                tooltipMessage="Terminar postura"
                                openButtonIcon={
                                  <IoMdExit className="text-lg" />
                                }
                                openDisabled={item.finished}
                                severity="danger"
                              />
                            </div>

                            <p className="mb-3 text-xs leading-5 text-slate-600">
                              {item.reason}
                            </p>

                            <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
                              <i className="bi bi-calendar3 text-xs text-slate-400" />

                              <time className="text-[11px] font-medium text-slate-500">
                                {item?.startDate?.format(
                                  'DD/MM/YYYY',
                                )}
                                {' → '}
                                {item?.endDate?.format(
                                  'DD/MM/YYYY',
                                )}
                              </time>
                            </div>

                            <div className="mt-2 flex items-center gap-2">
                              <i className="bi bi-person text-xs text-slate-400" />

                              <span className="text-[11px] text-slate-500">
                                Registrado por:{' '}
                                <span className="font-medium text-slate-600">
                                  {item?.byUser.name}
                                </span>
                              </span>
                            </div>
                          </div>
                        </li>
                      ),
                    )}
                  </ol>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};