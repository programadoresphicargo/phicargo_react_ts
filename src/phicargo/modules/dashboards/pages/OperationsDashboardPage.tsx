import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
import { Header } from '../components/Header';
import { Indicators } from '../components/Indicators';
import { PodsDeliveredChart } from '../components/PodsDeliveredChart';
import { TravelsByCargoType } from '../components/TravelsByCargoType';
import { TravelsByClientChart } from '../components/TravelsByClientChart';
import { TravelsByConstruction } from '../components/TravelsByConstruction';
import { TravelsByMonthChart } from '../components/TravelsByMonthChart';
import { TravelsByTrafficExecutive } from '../components/TravelsByTrafficExecutive';
import { useTravelStatsQueries } from '../hooks/useTravelStatsQueries';

Chart.register(CategoryScale);

const OperationsDashboardPage = () => {
  const { travelStatsQuery } = useTravelStatsQueries();

  return (
    <div className="p-4">
      <Header />
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <Indicators />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
        <PodsDeliveredChart
          isLoading={travelStatsQuery.isFetching}
          data={travelStatsQuery.data}
        />
        <TravelsByTrafficExecutive 
          isLoading={travelStatsQuery.isFetching}
          data={travelStatsQuery.data}
        />
        <TravelsByConstruction 
          isLoading={travelStatsQuery.isFetching}
          data={travelStatsQuery.data}
        />
        <TravelsByCargoType 
          isLoading={travelStatsQuery.isFetching}
          data={travelStatsQuery.data}
        />
        <TravelsByMonthChart
          isLoading={travelStatsQuery.isFetching}
          data={travelStatsQuery.data}
        />
        <div className="col-span-1 sm:col-span-2">
          <TravelsByClientChart
            isLoading={travelStatsQuery.isFetching}
            data={travelStatsQuery.data}
          />
        </div>
      </div>
    </div>
  );
};

export default OperationsDashboardPage;

