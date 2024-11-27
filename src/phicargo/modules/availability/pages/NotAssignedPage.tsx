import DriverMiniCard from '../components/DriverMiniCard';
import NotAssignedCard from '../components/NotAssignedCard';
import NotAssignedStats from '../utilities/get-not-assigned-stats';
import VehicleMiniCard from '../components/VehicleMiniCard';
import { useDriverQueries } from '../hooks/useDriverQueries';
import { useMemo } from 'react';
import { useVehicleQueries } from '../hooks/useVehicleQueries';

const NotAssignedPage = () => {
  const {
    vehicleWithDriverQuery: { data: vehiclesWithDriver },
  } = useVehicleQueries();

  const {
    driversQuery: { data: drivers },
  } = useDriverQueries();

  const stats = useMemo(() => {
    if (!vehiclesWithDriver || !drivers) return null;
    const notAssignedStats = new NotAssignedStats(vehiclesWithDriver, drivers);
    return notAssignedStats.getNotAssignedStats();
  }, [vehiclesWithDriver, drivers]);

  return (
    <div className="p-2 grid grid-cols-1 md:grid-cols-3 gap-3">
      <NotAssignedCard
        title="Unidades Sin Asignar"
        count={stats?.vehicles.length || 0}
      >
        {stats?.vehicles.map((vehicle) => (
          <VehicleMiniCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </NotAssignedCard>

      <NotAssignedCard
        title="Operadores Disponibles"
        count={stats?.drivers.length || 0}
      >
        {stats?.drivers.map((driver) => (
          <DriverMiniCard key={driver.id} driver={driver} />
        ))}
      </NotAssignedCard>

      <NotAssignedCard
        title="Unidades Asignadas"
        count={stats?.vehiclesAssigned.length || 0}
      >
        {stats?.vehiclesAssigned.map((vehicle) => (
          <VehicleMiniCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </NotAssignedCard>
    </div>
  );
};

export default NotAssignedPage;

