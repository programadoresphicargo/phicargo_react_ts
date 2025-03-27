import { Button, Card, CardBody, CardHeader } from '@heroui/react';

import { CreateDayOffModal } from '../../core/components';
import { Outlet } from 'react-router-dom';
import VehicleRevenueProjectionLayout from '../layouts/VehicleRevenueProjectionLayout';
import { VehicleRevenueProjectionTable } from '../components/vehicle-revenue-projection/VehicleRevenueProjectionTable';
import { useState } from 'react';

const VehicleRevenueProjectionPage = () => {

  const [createDayOff, setCreateDayOff] = useState(false);

  return (
    <VehicleRevenueProjectionLayout>
      <section>
        <Card
          classNames={{
            base: 'border-2 border-gray-200 shadow-none',
            header: 'bg-gray-100 px-4 py-1',
          }}
          radius="md"
        >
          <CardHeader className="flex items-center justify-between">
            <h3 className="text-gray-800 font-bold text-lg">
              Ajustes
            </h3>
          </CardHeader>
          <CardBody>
            <Button
              color="primary"
              size="sm"
              radius='full'
              onPress={() => setCreateDayOff(true)}
            >
              Registrar Día Inhabil
            </Button>
          </CardBody>
        </Card>
      </section>

      <VehicleRevenueProjectionTable />
      <Outlet />
      <CreateDayOffModal open={createDayOff} onClose={() => setCreateDayOff(false)} />
    </VehicleRevenueProjectionLayout>
  );
};

export default VehicleRevenueProjectionPage;

