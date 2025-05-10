import { Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import { HeroAutocompleteInput } from '@/components/inputs';
import type { Driver } from '../models';
import { useForm } from 'react-hook-form';

import { SaveButton } from '@/components/ui';
import {
  useGetTrailersByDriverQuery,
  useGetTrailersQuery,
} from '@/modules/vehicles/hooks/queries';
import { useEffect, useMemo } from 'react';
import { Trailer } from '@/modules/vehicles/models';
import { useTrailerDriverAssignmentMutation } from '@/modules/vehicles/hooks/mutations';
import toast from 'react-hot-toast';

interface TrailerAssignmentForm {
  trailer1Id: number | null;
  trailer2Id: number | null;
}

const initialStateForm: TrailerAssignmentForm = {
  trailer1Id: null,
  trailer2Id: null,
};

interface Props {
  driver: Driver;
}

const transformDriverTrailersToTrailerAssignment = (
  trailers?: Trailer[],
): TrailerAssignmentForm => {
  if (!trailers) return initialStateForm;

  const trailer1Id = trailers[0]?.id || null;
  const trailer2Id = trailers[1]?.id || null;
  return {
    trailer1Id: trailer1Id ? (String(trailer1Id) as unknown as number) : null,
    trailer2Id: trailer2Id ? (String(trailer2Id) as unknown as number) : null,
  };
};

export const TrailerAssignment = (props: Props) => {
  const { driver } = props;

  const { trailerOptions, isLoading, getTrailersQuery } = useGetTrailersQuery();

  const {
    getTrailersByDriverQuery: { data: driverTrailers },
  } = useGetTrailersByDriverQuery(driver.id);

  const { trailerDriverAssignmentMutation: mutation } =
    useTrailerDriverAssignmentMutation();

  const formData = useMemo(() => {
    return transformDriverTrailersToTrailerAssignment(driverTrailers);
  }, [driverTrailers]);

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
        <form className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <HeroAutocompleteInput
              control={control}
              name="trailer1Id"
              label="Remolque 1"
              placeholder="Selecciona un remolque"
              items={trailerOptions}
              isLoading={isLoading}
            />

            <TrailerInfo trailer={trailer1} />

            <SaveButton
              onPress={() =>
                handleSubmit((data) => onSubmit(data, 'trailer1Id'))()
              }
              className="w-full uppercase"
              isDisabled={mutation.isPending}
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
              isDisabled={
                driver?.modality === 'single' || driver?.modality === 'sencillo'
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
                mutation.isPending
              }
              variant="flat"
            >
              Guardar Remolque 2
            </SaveButton>
          </div>
        </form>
      </CardBody>
      <CardFooter className="pt-0"></CardFooter>
    </Card>
  );
};

const TrailerInfo = ({ trailer }: { trailer?: Trailer | null }) => {
  return (
    <>
      {trailer ? (
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 animate-fade-in">
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
            Información del remolque
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500">Nombre</span>
              <span className="text-sm text-gray-800">{trailer.name}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500">
                Operador
              </span>
              <span
                className={`text-sm ${
                  trailer.driver?.name ? 'text-gray-800' : 'text-gray-400'
                }`}
              >
                {trailer.driver?.name || 'Sin operador asignado'}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500">Tipo</span>
              <span className="text-sm text-gray-800">{trailer.fleetType}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500">Estatus</span>
              <span className="text-sm text-gray-800 uppercase">
                {trailer.status}
              </span>
            </div>
          </div>
        </div>
      ) : (
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
      )}
    </>
  );
};

