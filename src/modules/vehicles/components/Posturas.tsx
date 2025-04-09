import { Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import {
  DatePickerInput,
  DriverSearchInput,
  TextInput,
} from '@/components/inputs';
import type { Postura, PosturaCreate, Vehicle } from '../../vehicles/models';
import { SubmitHandler, useForm } from 'react-hook-form';
import dayjs, { Dayjs } from 'dayjs';

import { AlertDialog } from '@/components';
import { FaCalendarMinus } from 'react-icons/fa';
import { IoMdExit } from 'react-icons/io';
import { SaveButton } from '@/components/ui';
import { useCreatePosturaMutation } from '../hooks/mutations';
import { useGetPosturasByVehicleQuery } from '../hooks/queries';
import { useState } from 'react';

const initialState: PosturaCreate = {
  driverId: '' as unknown as number,
  reason: '',
  startDate: null as unknown as Dayjs,
  endDate: null as unknown as Dayjs,
};

interface Props {
  vehicle: Vehicle;
}

export const Posturas = ({ vehicle }: Props) => {
  const { control, handleSubmit, reset } = useForm<PosturaCreate>({
    defaultValues: initialState,
  });

  const [itemSelected, setItemSelected] = useState<Postura | null>(null);

  const { getPosturasByVehicleQuery } = useGetPosturasByVehicleQuery(
    vehicle.id,
  );
  const { createPosturaMutation } = useCreatePosturaMutation();

  const onSubmit: SubmitHandler<PosturaCreate> = (data) => {
    if (createPosturaMutation.isPending) return;
    createPosturaMutation.mutate(
      {
        vehicleId: vehicle.id,
        data,
      },
      {
        onSuccess: () => {
          reset(initialState);
        },
      },
    );
  };

  return (
    <Card
      classNames={{
        base: 'shadow-none',
        header: 'bg-gray-300 px-4 py-1',
        body: 'overflow-y-auto h-80',
      }}
      radius="md"
    >
      <CardHeader className="flex items-center justify-between">
        <h3 className="text-gray-800 font-bold text-lg">
          Posturas de la Unidad
        </h3>
      </CardHeader>
      <CardBody>
        <div className="flex flex-row gap-4">
          <form className="flex flex-col gap-4 w-1/2">
            <DriverSearchInput control={control} name="driverId" required />

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
                        onConfirm={() => {}}
                        iconOnly
                        onOpenChange={(isOpen) =>
                          setItemSelected(isOpen ? item : null)
                        }
                        open={itemSelected?.id === item.id}
                        tooltipMessage="Terminar Postrura"
                        openButtonIcon={<IoMdExit className="text-xl" />}
                        openDisabled={!item.endDate.isAfter(dayjs())}
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
  );
};

