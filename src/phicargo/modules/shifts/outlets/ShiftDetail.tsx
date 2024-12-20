import { Button, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { DatePickerInput } from '../../core/components/inputs/DatePickerInput';
import { Dayjs } from 'dayjs';
import { DriverSearchInput } from '../../core/components/inputs/DriverSearchInput';
import { TextareaInput } from '../../core/components/inputs/TextareaInput';
import { VehicleSearchInput } from '../../core/components/inputs/VehicleSearchInput';
import { useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { useShiftQueries } from '../hooks/useShiftQueries';

interface ShiftEdit {
  vehicleId: number;
  driverId: number;
  arrivalAt: Dayjs;
  comments: string | null;
}

const ShiftDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { control } = useForm<ShiftEdit>();

  const { shiftQuery } = useShiftQueries({ branchId: 1 });

  const shift = useMemo(
    () => (shiftQuery.data || []).find((s) => s.id === Number(id)),
    [id, shiftQuery.data],
  );

  const onClose = () => {
    navigate('/turnos');
  };

  if (!id) {
    return <Navigate to="/turnos" />;
  }

  return (
    <Modal isOpen={true} onOpenChange={onClose} size="4xl">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex items-center justify-center bg-[#dadfeb] pb-2">
              <h3 className="font-bold text-xl text-center text-gray-800 uppercase">
                Detalles de Turno
              </h3>
            </ModalHeader>
            <ModalBody className="p-2">
              <div className="bg-gray-300 p-1 shadow-md rounded-lg">
                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  onPress={onClose}
                >
                  Guardar
                </Button>
              </div>
              <div className="flex flex-col md:flex-row p-1 gap-4">
                <div className="flex flex-col gap-4 bg-gray-300 shadow-md rounded-lg p-6">
                  <VehicleSearchInput control={control} name="vehicleId" />
                  <DriverSearchInput control={control} name="driverId" />
                  <DatePickerInput
                    control={control}
                    name="arrivalAt"
                    label="Fecha de llegada"
                  />
                  <TextareaInput
                    control={control}
                    name="comments"
                    label="Comentarios"
                  />
                  <div className="mt-4 text-sm text-gray-600">
                    <p>
                      Creado por:{' '}
                      <span className="font-medium">
                        {shift?.registerUserId}
                      </span>
                    </p>
                    <p>
                      Fecha de creación:{' '}
                      <span className="font-medium">
                        {shift?.registerDate.format('DD/MM/YYYY')}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Lado derecho: Maniobras */}
                <div className="w-3/5 bg-gray-300 shadow-md rounded-lg p-6">
                  <h3 className="font-bold text-lg text-gray-800 mb-4">
                    Últimas maniobras del operador
                  </h3>
                  <div className="space-y-6">
                    {/* Maniobra 1 */}
                    <div className="relative pl-6">
                      <div className="absolute top-0 left-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="font-medium text-gray-700">
                        Maniobra M-2095
                      </p>
                      <p className="text-sm text-gray-500">
                        Inicio programado: 2024/11/09 04:00pm
                      </p>
                      <div className="mt-2 pl-4 border-l-2 border-gray-300">
                        <p className="text-sm text-gray-600">Tipo: Ingreso</p>
                        <p className="text-sm text-gray-600">
                          Terminal: PATIO VERACRUZ
                        </p>
                        <p className="text-sm text-gray-600">
                          Vehículo: C-0103
                        </p>
                      </div>
                    </div>

                    {/* Maniobra 2 */}
                    <div className="relative pl-6">
                      <div className="absolute top-0 left-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="font-medium text-gray-700">
                        Maniobra M-2096
                      </p>
                      <p className="text-sm text-gray-500">
                        Inicio programado: 2024/11/09 04:30pm
                      </p>
                      <div className="mt-2 pl-4 border-l-2 border-gray-300">
                        <p className="text-sm text-gray-600">Tipo: Ingreso</p>
                        <p className="text-sm text-gray-600">
                          Terminal: PATIO VERACRUZ
                        </p>
                        <p className="text-sm text-gray-600">
                          Vehículo: C-0104
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ShiftDetail;

