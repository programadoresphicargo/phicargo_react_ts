import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
import { DistanceByDriverChart } from '../components/drivers/DistanceByDriverChart';
import { RevenueByDriverChart } from '../components/drivers/RevenueByDriverChart';
import { useDriverStatsQueries } from '../hooks/useDriverStatsQueries';

Chart.register(CategoryScale);

const DriverDashboardPage = () => {
  const { driversStatsQuery } = useDriverStatsQueries();

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        <div className="col-span-1 sm:col-span-2">
          <RevenueByDriverChart
            isLoading={driversStatsQuery.isFetching}
            data={driversStatsQuery.data}
          />
        </div>

        <div className="col-span-1 sm:col-span-2">
          <DistanceByDriverChart
            isLoading={driversStatsQuery.isFetching}
            data={driversStatsQuery.data}
          />
        </div>
      </div>
    </div>
  );
};

export default DriverDashboardPage;

