import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@nextui-org/react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';

import { FaRegSave } from 'react-icons/fa';
import type { IncidenceCreate } from '../models/driver-incidence-model';
import { SelectInput } from '../../core/components/inputs/SelectInput';
import { SelectItem } from '../../core/types/global-types';
import { TextareaInput } from '../../core/components/inputs/TextareaInput';
import { useIncidenceQueries } from '../hooks/useIncidenceQueries';
import { useMemo } from 'react';
import { useShiftQueries } from '../hooks/useShiftQueries';

const intialState: IncidenceCreate = {
  incidence: '',
  comments: '',
};

const incidenceType: SelectItem[] = [
  { key: 'EFECTOS', value: 'CONDUCIR BAJO LOS EFECTOS DEL ALCOHOL O DROGAS' },
  { key: 'TRAFFICO', value: 'VIOLACIONES DE TRAFICO' },
  {
    key: 'SEGURIDAD',
    value: 'INCUMPLIMIENTO DE REGLAMENTACIONES DE SEGURIDAD',
  },
  { key: 'MANTENIMIENTO', value: 'MANTENIMIENTO DEFICIENTE DEL VEHICULO' },
  { key: 'CONDUCTA', value: 'CONDUCTA AGRESIVA O IMPRUDENTE' },
  { key: 'CARGA', value: 'INCUMPLIMIENTO DE NORMAS DE CARGA Y PESO' },
  { key: 'DOCUMENTACION', value: 'DOCUMENTACION Y REGISTROS INCORRECTOS' },
  {
    key: 'MANIOBRA_NO_REALIZADA',
    value: 'OPERADOR NO QUISO HACER UNA MANIOBRA',
  },
  { key: 'MANIOBRA_ABANDONADA', value: 'OPERADOR DEJO BOTADA LA MANIOBRA' },
  { key: 'NO-TOMO-EQUIPO', value: 'NO TOMO EQUIPO ASIGNADO' },
];

const CreateIncidence = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { shifts } = useShiftQueries();
  const { createIncidence } = useIncidenceQueries();

  const { control, handleSubmit } = useForm<IncidenceCreate>({
    defaultValues: intialState,
  });

  const shift = useMemo(() => {
    return shifts.find((r) => r.id === Number(id));
  }, [shifts, id]);

  const onSubmit: SubmitHandler<IncidenceCreate> = (data) => {
    if(!shift || !id) return;
    console.log(data);
    createIncidence.mutate({
      driverId: shift.driver.id,
      incidence: data,
    }, {
      onSuccess: () => {
        navigate('/turnos');
      },
    });
  };

  const onClose = () => {
    navigate('/turnos');
  };

  if (!id) {
    return <Navigate to="/turnos" />;
  }

  return (
    <Modal isOpen={true} onOpenChange={onClose} size="lg">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex items-center justify-center bg-[#dadfeb] pb-2">
              <h3 className="font-bold text-xl text-center text-gray-800 uppercase">
                Crear Incidencia
              </h3>
            </ModalHeader>
            <ModalBody className="p-2">
              <div className="flex flex-col gap-4 border-2 rounded-lg p-3">
                <SelectInput
                  control={control}
                  name="incidence"
                  label="Tipo de Incidencia"
                  items={incidenceType}
                  rules={{ required: 'Tipo de incidencia requerida' }}
                />
                <TextareaInput
                  control={control}
                  name="comments"
                  label="Comentarios"
                  isUpperCase
                  minRows={6}
                  rules={{ required: 'Comentario requerido' }}
                />
              </div>
              <Button
                onPress={() => handleSubmit(onSubmit)()}
                className="w-full mt-4"
                color="primary"
                startContent={<FaRegSave />}
                isLoading={createIncidence.isPending}
              >
                Guardar
              </Button>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateIncidence;

