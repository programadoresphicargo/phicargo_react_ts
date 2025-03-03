import { AvailableSummaryChart } from '../components/vehicles/AvailableSummaryChart';
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
import { DistanceByVehiclesChart } from '../components/vehicles/DistanceByVehiclesChart';
import { RevenueByVehicleChart } from '../components/vehicles/RevenueByVehiclesChart';
import { useVehiclesStatsQueries } from '../hooks/useVehiclesStatsQueries';

Chart.register(CategoryScale);

const VehiclesDashboard = () => {
  const { vehiclesStatsQuery } = useVehiclesStatsQueries();

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        <AvailableSummaryChart 
          isLoading={vehiclesStatsQuery.isFetching}
          data={vehiclesStatsQuery.data}
        />
        <div>
          
        </div>
        <RevenueByVehicleChart
          isLoading={vehiclesStatsQuery.isFetching}
          data={vehiclesStatsQuery.data}
        />
        <DistanceByVehiclesChart
          isLoading={vehiclesStatsQuery.isFetching}
          data={vehiclesStatsQuery.data}
        />
      </div>
    </div>
  );
};

export default VehiclesDashboard;

