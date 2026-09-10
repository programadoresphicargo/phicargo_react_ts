import { LoadingSpinner, RefreshButton } from '@/components/ui';
import { Card, CardBody, CardHeader, Chip, Divider } from '@heroui/react';
import {
  MaintenanceRecord,
} from '../../models';
import { useEffect, useState } from 'react';
import odooApi from '@/api/odoo-api';
import dayjs from 'dayjs';

interface Props {
  record: MaintenanceRecord;
}

interface Travel {
  operador: string;
  fecha_finalizado: string;
  name: string;
  x_status_viaje: string;
}

interface Maneuver {
  id_maniobra: number;
  tipo_maniobra: string;
  fecha_finalizada: string;
  operador: string;
  estado_maniobra: string
}

interface VehicleOperations {
  travels: Travel[];
  maneuvers: Maneuver[];
}

export const VehicleHistory = ({ record }: Props) => {

  const [isLoading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<VehicleOperations>({
    travels: [],
    maneuvers: [],
  });

  const fetchData = async () => {
    try {
      const response = await odooApi.get(`/vehicles/history/${record.vehicle.id}?limit=10`);
      setData(response.data);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Card
        classNames={{
          base: 'shadow-none',
          header: 'bg-gray-100 px-4 py-1',
          body: 'overflow-y-auto h-72',
        }}
        radius="md"
      >
        <CardBody>
          <LoadingSpinner />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card
      classNames={{
        base: 'shadow-none',
        header: 'bg-gray-100 px-4 py-1',
        body: 'overflow-y-auto h-72',
      }}
      radius="md"
    >
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RefreshButton onRefresh={() => fetchData()} isLoading={isLoading} />
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Viajes */}
          <Card shadow="sm" className="border border-default-200">
            <CardHeader className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-lg font-semibold text-default-900">
                  Viajes
                </p>
                <p className="text-sm text-default-500">
                  Últimos viajes realizados
                </p>
              </div>

              <Chip
                size="sm"
                color="primary"
                variant="flat"
              >
                {data.travels.length}
              </Chip>
            </CardHeader>

            <Divider />

            <CardBody className="gap-3 p-4">
              {data.travels.length > 0 ? (
                data.travels.map((travel) => (
                  <div
                    key={travel.referencia}
                    className="
              rounded-xl
              border border-default-200
              bg-default-50
              p-4
              transition-all
              hover:border-primary-200
              hover:bg-primary-50/30
            "
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-default-900">
                          {travel.name}
                        </p>

                        <p className="mt-1 text-sm text-default-500">
                          {travel.operador}
                        </p>
                      </div>

                      <Chip
                        size="sm"
                        variant="flat"
                        color="success"
                      >
                        {travel.x_status_viaje}
                      </Chip>
                    </div>

                    <Divider className="my-3" />

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-default-400">
                        {travel.x_status_viaje}
                      </span>

                      <span className="text-sm font-medium text-default-600">
                        {dayjs(travel.fecha_finalizado).format(
                          "DD MMM YYYY · HH:mm"
                        )}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-default-500">
                    No hay viajes registrados.
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Maniobras */}
          <Card shadow="sm" className="border border-default-200">
            <CardHeader className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-lg font-semibold text-default-900">
                  Maniobras
                </p>
                <p className="text-sm text-default-500">
                  Últimas maniobras realizadas
                </p>
              </div>

              <Chip
                size="sm"
                color="warning"
                variant="flat"
              >
                {data.maneuvers.length}
              </Chip>
            </CardHeader>

            <Divider />

            <CardBody className="gap-3 p-4">
              {data.maneuvers.length > 0 ? (
                data.maneuvers.map((maneuver) => (
                  <div
                    key={maneuver.id_maniobra}
                    className="
              rounded-xl
              border border-default-200
              bg-default-50
              p-4
              transition-all
              hover:border-warning-200
              hover:bg-warning-50/30
            "
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-default-900">
                          Maniobra #{maneuver.id_maniobra}
                        </p>

                        <p className="mt-1 text-sm text-default-500">
                          {maneuver.operador}
                        </p>
                      </div>

                      <Chip
                        size="sm"
                        color="warning"
                        variant="flat"
                        className="capitalize"
                      >
                        {maneuver.tipo_maniobra}
                      </Chip>
                    </div>

                    <Divider className="my-3" />

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-default-400">
                        {maneuver.estado_maniobra}
                      </span>

                      <span className="text-sm font-medium text-default-600">
                        {dayjs(maneuver.fecha_finalizada).format(
                          "DD MMM YYYY · HH:mm"
                        )}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-default-500">
                    No hay maniobras registradas.
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </CardBody>
    </Card>
  );
};

