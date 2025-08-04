import { Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import { SaveButton } from '@/components/ui';
import { Vehicle } from '../models/vehicle-models';
import odooApi from '@/api/odoo-api';
import { useEffect, useState } from 'react';

interface Props {
  vehicle: Vehicle;
}

const AssignmentsDriver = (props: Props) => {
  const { vehicle } = props;

  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/mail_message/model_res/', {
        params: {
          model: 'fleet.vehicle',
          res_id: vehicle.id
        }
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [vehicle.id]);

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
        <h3 className="text-gray-800 font-bold text-lg">Historial de asignaciones</h3>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : data.length === 0 ? (
          <p className="text-gray-500">No hay asignaciones registradas.</p>
        ) : (
          <ul className="space-y-2">
            {data.map((item: any, index: number) => (
              <li key={index} className="border-b pb-2">
                <p className="text-sm text-gray-800 whitespace-pre-line">{item.body}</p>
                <p className="text-xs text-gray-500">Fecha: {item.create_date}</p>
              </li>
            ))}
          </ul>
        )}
      </CardBody>

      <CardFooter className="pt-0">
        <SaveButton
          className="w-full uppercase"
          variant="flat"
        />
      </CardFooter>
    </Card>
  );
};

export default AssignmentsDriver;