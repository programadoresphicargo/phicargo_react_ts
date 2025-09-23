import { AvailableSummaryChart } from '../components/vehicles/AvailableSummaryChart';
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
import { DistanceAndRevenueByVehicleChart } from '../components/vehicles/DistanceAndRevenueByVehicleChart';
import { useVehiclesStatsQueries } from '../hooks/useVehiclesStatsQueries';
import { VehicleMaintenance } from '../components/vehicles/VehiclesMaintenance';

Chart.register(CategoryScale);

const VehiclesDashboard = () => {
  const { vehiclesStatsQuery } = useVehiclesStatsQueries();

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        <AvailableSummaryChart
          isLoading={vehiclesStatsQuery.isFetching}
          data={vehiclesStatsQuery.data}
        />
        <div className="col-span-2">
          <DistanceAndRevenueByVehicleChart
            isLoading={vehiclesStatsQuery.isFetching}
            data={vehiclesStatsQuery.data}
          />
        </div>
        <div className="col-span-2">
          <VehicleMaintenance
            isLoading={vehiclesStatsQuery.isFetching}
            data={vehiclesStatsQuery.data}
          />
        </div>
      </div>
    </div>
  );
};

export default VehiclesDashboard;

