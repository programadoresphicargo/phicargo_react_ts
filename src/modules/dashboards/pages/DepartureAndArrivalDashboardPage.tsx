import ArrivalStatusChart from '../components/departures-and-arrivals/ArrivalStatusChart';
import { ArrivalsStatusDriverChart } from '../components/departures-and-arrivals/ArrivalsStatusDriverChart';
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
import { DepartureStatusChart } from '../components/departures-and-arrivals/DepartureStatusChart';
import { useDepartureAndArrivalQueries } from '../hooks/useDepartureAndArrivalQueries';

Chart.register(CategoryScale);

const DepartureAndArrivalDashboardPage = () => {
  const { departureAndArrivalQuery } = useDepartureAndArrivalQueries();

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        <DepartureStatusChart
          data={departureAndArrivalQuery.data}
          isLoading={departureAndArrivalQuery.isFetching}
        />
        <ArrivalStatusChart
          isLoading={departureAndArrivalQuery.isFetching}
          data={departureAndArrivalQuery.data}
        />
        <div className="col-span-1 sm:col-span-2">
          <ArrivalsStatusDriverChart
            isLoading={departureAndArrivalQuery.isFetching}
            data={departureAndArrivalQuery.data}
          />
        </div>
      </div>
    </div>
  );
};

export default DepartureAndArrivalDashboardPage;

