import { Card, CardBody, CardFooter, Spinner } from '@heroui/react';
import {
  DatePickerInput,
  DriverSearchInput,
  TextInput,
  VehicleSearchInput,
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
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogTitle, Divider } from '@mui/material';

const initialState: PosturaCreate = {
  vehicleId: null as unknown as number,
  driverId: null as unknown as number,
  reason: '',
  startDate: null as unknown as Dayjs,
  endDate: null as unknown as Dayjs,
  finished: false
};

interface Props {
  open: boolean;
  handleClose: () => void;
}

export const PosturasForm = ({ open, handleClose }: Props) => {

  const queryClient = useQueryClient();

  const { control, handleSubmit, reset, watch } = useForm<PosturaCreate>({
    defaultValues: initialState,
  });

  const vehicle_id = watch("vehicleId");

  const [itemSelected, setItemSelected] = useState<Postura | null>(null);

  const { getPosturasByVehicleQuery } = useGetPosturasByVehicleQuery(
    vehicle_id ?? 0,
  );
  const { createPosturaMutation } = useCreatePosturaMutation();
  const { finishPosturaMutation } = useFinishPosturaMutation();

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
          queryKey: ['posturas-vehicle', vehicle_id],
        });
      },
    });
  };

  const driverId = watch('driverId');
  const vehicleId = watch('vehicleId');

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle
        style={{
          background: 'linear-gradient(70deg, #004494, #002887)',
          color: 'white',
          fontWeight: 'bold',
          fontFamily: 'Inter'
        }}>
        Posturas
      </DialogTitle>
      <Divider></Divider>
      <DialogContent>

        <Card
          radius="md"
        >
          <CardBody>
            <div className="flex flex-row gap-4">
              <form className="flex flex-col gap-4 w-1/2">

                <VehicleSearchInput control={control} name='vehicleId' vehicleId={vehicleId} required />
                <DriverSearchInput control={control} name="driverId" driverId={driverId} required />

                <TextInput
                  control={control}
                  name="reason"
                  label="Motivo de postura"
                  rules={{ required: 'Este campo es requerido' }}
                />

                <DatePickerInput
                  control={control}
                  name="startDate"
                  label="Fecha de inicio"
                  rules={{ required: 'Este campo es requerido' }}
                />

                <DatePickerInput
                  control={control}
                  name="endDate"
                  label="Fecha fin"
                  rules={{ required: 'Este campo es requerido' }}
                />
              </form>
              <div>
                <ol className="relative border-s border-gray-200">

                  {getPosturasByVehicleQuery.isLoading && (
                    <Spinner />
                  )}

                  {getPosturasByVehicleQuery.data?.map((item) => (
                    <li className="mb-10 ms-6">
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white">
                        <FaCalendarMinus className="w-2.5 h-2.5 text-blue-800" />
                      </span>
                      <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
                        {item.driver}
                        <div className="flex items-center gap-2 ml-auto">
                          <AlertDialog
                            title="Terminar Postura"
                            message="¿Está seguro que desea terminar la postura"
                            onConfirm={() => onFinishPostura(item.id)}
                            iconOnly
                            onOpenChange={(isOpen) =>
                              setItemSelected(isOpen ? item : null)
                            }
                            open={itemSelected?.id === item.id}
                            tooltipMessage="Terminar Postrura"
                            openButtonIcon={<IoMdExit className="text-xl" />}
                            openDisabled={item.finished}
                          />
                        </div>
                      </h3>
                      <p className="mb-2 text-base font-normal text-gray-700">
                        {item.reason}
                      </p>
                      <time className="block mb-2 text-sm font-normal leading-none text-gray-600 uppercase">
                        {item?.startDate?.format('DD/MM/YYYY')} {'-> '}
                        {item?.endDate?.format('DD/MM/YYYY')}
                      </time>
                      <p className="mb-4 text-base font-normal text-gray-500">
                        <p className="text-sm text-gray-600">
                          Por: {item?.byUser.name}
                        </p>
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <SaveButton
              onPress={() => handleSubmit(onSubmit)()}
              className="w-full uppercase"
              isLoading={createPosturaMutation.isPending}
              variant="flat"
            />
          </CardFooter>
        </Card>

      </DialogContent>
    </Dialog>
  );
};

