import { Header } from '../components/Header';
import { Indicators } from '../components/Indicators';
import { PodsDeliveredChart } from '../components/PodsDeliveredChart';
import { TravelsByClientChart } from '../components/TravelsByClientChart';
import { TravelsByMonthChart } from '../components/TravelsByMonthChart';
import { useTravelStatsQueries } from '../hooks/useTravelStatsQueries';

const OperationsDashboardPage = () => {
  const { travelStatsQuery } = useTravelStatsQueries();

  return (
    <div className="p-4">
      <Header />
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        <Indicators />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-4">
        <PodsDeliveredChart
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

