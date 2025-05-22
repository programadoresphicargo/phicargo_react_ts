import { Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import { HeroAutocompleteInput } from '@/components/inputs';
import type { Driver } from '../models';
import { useForm } from 'react-hook-form';

import { Alert, SaveButton } from '@/components/ui';
import {
  useGetTrailersByDriverQuery,
  useGetTrailersQuery,
} from '@/modules/vehicles/hooks/queries';
import { useEffect, useMemo } from 'react';
import { Trailer } from '@/modules/vehicles/models';
import { useTrailerDriverAssignmentMutation } from '@/modules/vehicles/hooks/mutations';
import toast from 'react-hot-toast';
import { useAuthContext } from '@/modules/auth/hooks';

const EDIT_DRIVER_TRAILER = 212;

interface TrailerAssignmentForm {
  trailer1Id: number | null;
  trailer2Id: number | null;
  dollyId: number | null;
}

interface Props {
  driver: Driver;
}

export const TrailerAssignment = (props: Props) => {
  const { driver } = props;

  const { session } = useAuthContext();

  const { user } = session || {};

  const disabled = !user?.permissions.includes(EDIT_DRIVER_TRAILER);

  const { trailerOptions, isLoading, getTrailersQuery } = useGetTrailersQuery();
  const {
    trailerOptions: dollyOptions,
    isLoading: isLoadingDolly,
    getTrailersQuery: getDollyTrailersQuery,
  } = useGetTrailersQuery('dolly');

  const {
    getTrailersByDriverQuery: { data: driverTrailers },
  } = useGetTrailersByDriverQuery(driver.id, 'trailer');

  const {
    getTrailersByDriverQuery: { data: driverDolly },
  } = useGetTrailersByDriverQuery(driver.id, 'dolly');

  const { trailerDriverAssignmentMutation: mutation } =
    useTrailerDriverAssignmentMutation();

  const formData = useMemo(() => {
    return transformDriverTrailersToTrailerAssignment(
      driverTrailers,
      driverDolly,
    );
  }, [driverTrailers, driverDolly]);

  const { control, handleSubmit, watch, reset } =
    useForm<TrailerAssignmentForm>({
      defaultValues: formData,
    });

  const trailer1Id = watch('trailer1Id');
  const trailer1 = useMemo(
    () =>
      getTrailersQuery.data?.find(
        (trailer) => trailer.id === Number(trailer1Id),
      ),
    [getTrailersQuery.data, trailer1Id],
  );

  const trailer2Id = watch('trailer2Id');
  const trailer2 = useMemo(
    () =>
      getTrailersQuery.data?.find(
        (trailer) => trailer.id === Number(trailer2Id),
      ),
    [getTrailersQuery.data, trailer2Id],
  );

  const dollyId = watch('dollyId');
  const dolly = useMemo(
    () =>
      getDollyTrailersQuery.data?.find((dolly) => dolly.id === Number(dollyId)),
    [getDollyTrailersQuery.data, dollyId],
  );

  const onSubmit = (
    data: TrailerAssignmentForm,
    trailer: keyof TrailerAssignmentForm,
  ) => {
    if (!driver) return;
    if (mutation.isPending) return;

    // Validation to prevent assigning the same trailer to both positions
    if (
      data.trailer1Id &&
      data.trailer2Id &&
      data.trailer1Id === data.trailer2Id
    ) {
      toast.error(
        'No puedes asignar el mismo remolque a dos posiciones diferentes',
      );
      return;
    }

    // Procesar cambios para trailer1
    if (data[trailer] !== formData[trailer]) {
      if (formData[trailer]) {
        mutation.mutate({
          id: formData[trailer],
          updatedItem: {
            trailerId: formData[trailer],
            driverId: null,
          },
        });
      }

      if (data[trailer]) {
        mutation.mutate(
          {
            id: data[trailer],
            updatedItem: {
              trailerId: data[trailer],
              driverId: driver.id,
            },
          },
          {
            onError: () => {
              reset(formData);
            },
          },
        );
      }
    }
  };

  useEffect(() => {
    reset(formData);
  }, [formData, reset]);

  return (
    <Card
      classNames={{
        base: 'shadow-none',
        header: 'bg-gray-200 px-4 py-1',
        body: 'overflow-y-auto h-80',
      }}
      radius="md"
    >
      <CardHeader className="flex items-center justify-between">
        <h3 className="text-gray-800 font-bold text-lg">
          Asignación de Remolques
        </h3>
      </CardHeader>
      <CardBody>
        <form className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-4">
            <HeroAutocompleteInput
              control={control}
              name="trailer1Id"
              label="Remolque 1"
              placeholder="Selecciona un remolque"
              items={trailerOptions}
              readOnly={disabled}
              isLoading={isLoading}
            />

            <TrailerInfo trailer={trailer1} />

            <SaveButton
              onPress={() =>
                handleSubmit((data) => onSubmit(data, 'trailer1Id'))()
              }
              className="w-full uppercase"
              isDisabled={mutation.isPending || disabled}
              variant="flat"
            >
              Guardar Remolque 1
            </SaveButton>
          </div>

          <div className="flex flex-col gap-4">
            <HeroAutocompleteInput
              control={control}
              name="trailer2Id"
              label="Remolque 1"
              readOnly={disabled}
              isDisabled={
                driver?.modality === 'single' ||
                driver?.modality === 'sencillo' ||
                driver?.modality === null
              }
              placeholder="Selecciona un remolque"
              items={trailerOptions}
              isLoading={isLoading}
            />

            <TrailerInfo trailer={trailer2} />

            <SaveButton
              onPress={() =>
                handleSubmit((data) => onSubmit(data, 'trailer2Id'))()
              }
              className="w-full uppercase"
              isDisabled={
                driver?.modality === 'single' ||
                driver?.modality === 'sencillo' ||
                driver?.modality === null ||
                mutation.isPending ||
                disabled
              }
              variant="flat"
            >
              Guardar Remolque 2
            </SaveButton>
          </div>

          {driver?.modality === 'full' && (
            <div className="flex flex-col gap-4">
              <HeroAutocompleteInput
                control={control}
                name="dollyId"
                label="Dolly"
                readOnly={disabled}
                placeholder="Selecciona un dolly"
                items={dollyOptions}
                isLoading={isLoadingDolly}
              />

              <TrailerInfo trailer={dolly} />

              <SaveButton
                onPress={() =>
                  handleSubmit((data) => onSubmit(data, 'dollyId'))()
                }
                className="w-full uppercase"
                isDisabled={disabled}
                variant="flat"
              >
                Guardar Dolly
              </SaveButton>
            </div>
          )}
        </form>
        {disabled && (
          <Alert
            title="No tienes permisos para editar la asignación de remolques"
            description="Contacta a un administrador para obtener acceso."
            color="warning"
          />
        )}
      </CardBody>
      <CardFooter className="pt-0"></CardFooter>
    </Card>
  );
};

const transformDriverTrailersToTrailerAssignment = (
  trailers?: Trailer[],
  dolly?: Trailer[],
): TrailerAssignmentForm => {
  const trailer1Id = (trailers ?? [])[0]?.id || null;
  const trailer2Id = (trailers ?? [])[1]?.id || null;
  const dollyId = dolly?.[0]?.id || null;
  return {
    trailer1Id: trailer1Id ? (String(trailer1Id) as unknown as number) : null,
    trailer2Id: trailer2Id ? (String(trailer2Id) as unknown as number) : null,
    dollyId: dollyId ? (String(dollyId) as unknown as number) : null,
  };
};

const TrailerInfo = ({ trailer }: { trailer?: Trailer | null }) => {
  if (!trailer) {
    return (
      <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 text-center animate-fade-in">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 mx-auto text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <h4 className="mt-2 text-sm font-medium text-blue-800">
          No hay remolque seleccionado
        </h4>
        <p className="text-xs text-blue-600 mt-1">
          Selecciona un remolque para ver su información
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-200 animate-fade-in">
      <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-blue-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
        </svg>
        Información
      </h3>
      <ul className="text-sm text-gray-800 space-y-1">
        <li>
          <span className="font-medium text-gray-500">Operador: </span>
          {trailer.driver?.name || (
            <span className="text-gray-400">Sin operador asignado</span>
          )}
        </li>
        <li>
          <span className="font-medium text-gray-500">Tipo: </span>
          {trailer.fleetType}
        </li>
        <li>
          <span className="font-medium text-gray-500">Estatus: </span>
          <span className="uppercase">{trailer.status}</span>
        </li>
      </ul>
    </div>
  );
};

