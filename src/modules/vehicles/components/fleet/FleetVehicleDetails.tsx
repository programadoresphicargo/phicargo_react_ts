import { Tabs, Tab, Card, CardBody } from '@heroui/react';
import { ViajeProvider } from '@/phicargo/viajes/context/viajeContext';
import { ManiobraProvider } from '@/phicargo/maniobras/context/viajeContext';
import HistorialViajesVehiculo from '@/phicargo/disponiblidad/equipos/historial_viajes';
import { Fleet } from '../../models';
import HistorialManiobrasVehiculo from '@/phicargo/disponiblidad/equipos/historial_maniobras';

interface Props {
  vehicle: Fleet;
}

export const FleetVehicleDetails = ({ vehicle }: Props) => {
  return (
    <>
      <Tabs aria-label="Options" color="primary">
        <Tab key="viajes" title="Viajes" disabled={true}>
          <Card>
            <CardBody>
              <ViajeProvider>
                <HistorialViajesVehiculo vehicle_id={vehicle.id} />
              </ViajeProvider>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="maniobras" title="Maniobras">
          <Card>
            <CardBody>
              <ManiobraProvider>
                <HistorialManiobrasVehiculo vehicle_id={vehicle.id} />
              </ManiobraProvider>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </>
  );
};

