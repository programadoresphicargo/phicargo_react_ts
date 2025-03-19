import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
import { DangerousLicenseSummaryChart } from '../components/drivers/DangerousLicenseSummaryChart';
import { DistanceAndRevenueByDriverChart } from '../components/drivers/DistanceAndRevenueByDriverChart';
import { DriverVehicleDistributionSummaryChart } from '../components/drivers/DriverVehicleDistributionSummaryChart';
import { JobSummaryChart } from '../components/drivers/JobSummaryChart';
import { ModalitySummaryChart } from '../components/drivers/ModalitySummaryChart';
import { useDriverStatsQueries } from '../hooks/useDriverStatsQueries';

Chart.register(CategoryScale);

const DriverDashboardPage = () => {
  const { driversStatsQuery } = useDriverStatsQueries();

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        <div className='col-span-1 sm:col-span-2'>
          <DriverVehicleDistributionSummaryChart
            isLoading={driversStatsQuery.isFetching}
            data={driversStatsQuery.data}
          />
        </div>
        <ModalitySummaryChart
          isLoading={driversStatsQuery.isFetching}
          data={driversStatsQuery.data}
        />

        <JobSummaryChart
          isLoading={driversStatsQuery.isFetching}
          data={driversStatsQuery.data}
        />

        <DangerousLicenseSummaryChart
          isLoading={driversStatsQuery.isFetching}
          data={driversStatsQuery.data}
        />

        <div className="col-span-1 sm:col-span-3">
          <DistanceAndRevenueByDriverChart
            isLoading={driversStatsQuery.isFetching}
            data={driversStatsQuery.data}
          />
        </div>
      </div>
    </div>
  );
};

export default DriverDashboardPage;

