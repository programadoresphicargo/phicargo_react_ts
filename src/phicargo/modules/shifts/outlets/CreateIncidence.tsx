import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';

import { DatePickerInput } from '../../core/components/inputs/DatePickerInput';
import { Dayjs } from 'dayjs';
import { FaRegSave } from 'react-icons/fa';
import type { IncidenceCreate } from '../models/driver-incidence-model';
import { SelectInput } from '../../core/components/inputs/SelectInput';
import { SelectItem } from "@/types";
import { TextareaInput } from '../../core/components/inputs/TextareaInput';
import { useIncidenceQueries } from '../hooks/useIncidenceQueries';
import { useMemo } from 'react';
import { useShiftQueries } from '../hooks/useShiftQueries';

const intialState: IncidenceCreate = {
  incidence: '',
  comments: '',
  startDate: null as unknown as Dayjs,
  endDate: null as unknown as Dayjs,
};

const incidenceValues: string[] = [
  'CONDUCIR BAJO LOS EFECTOS DEL ALCOHOL O DROGAS',
  'VIOLACIONES DE TRAFICO',
  'INCUMPLIMIENTO DE REGLAMENTACIONES DE SEGURIDAD',
  'MANTENIMIENTO DEFICIENTE DEL VEHICULO',
  'CONDUCTA AGRESIVA O IMPRUDENTE',
  'INCUMPLIMIENTO DE NORMAS DE CARGA Y PESO',
  'DOCUMENTACION Y REGISTROS INCORRECTOS',
  'OPERADOR NO QUISO HACER UNA MANIOBRA',
  'OPERADOR DEJO BOTADA LA MANIOBRA',
  'NO TOMO EQUIPO ASIGNADO'
];
const incidenceType: SelectItem[] = incidenceValues.map((r) => ({ key: r, value: r }));

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
                <div className="flex flex-row gap-4">
                  <DatePickerInput 
                    control={control}
                    name="startDate"
                    label="Fecha Inicio"
                    rules={{ required: 'Fecha de inicio requerida' }}
                  />

                  <DatePickerInput 
                    control={control}
                    name="endDate"
                    label="Fecha Fin"
                    rules={{ required: 'Fecha de fin requerida' }}
                  />
                </div>
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

