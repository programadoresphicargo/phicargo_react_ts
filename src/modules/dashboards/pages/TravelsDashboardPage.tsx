import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
import { FrequentRoutesChart } from '../components/travels/FrequentRoutesChart';
import { MonthProjectionChart } from '../components/travels/MonthProjectionChart';
import { MonthlyTravelsChart } from '../components/travels/MonthlyTravelsChart';
import { PodsDeliveredChart } from '../components/travels/PodsDeliveredChart';
import { ProjectionHistoryChart } from '../components/travels/ProjectionHistoryChart';
import { TravelIndicators } from '../components/travels/TravelIndicators';
import { TravelsByCargoType } from '../components/travels/TravelsByCargoType';
import { TravelsByCategoryChart } from '../components/travels/TravelsByCategoryChart';
import { TravelsByClientChart } from '../components/travels/TravelsByClientChart';
import { TravelsByConstruction } from '../components/travels/TravelsByConstruction';
import { TravelsByTrafficExecutive } from '../components/travels/TravelsByTrafficExecutive';
import { YearlyTravelsChart } from '../components/travels/YearlyTravelsChart';
import { useTravelStatsQueries } from '../hooks/useTravelStatsQueries';

Chart.register(CategoryScale);

const TravelsDashboardPage = () => {
  const { travelStatsQuery } = useTravelStatsQueries();

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <TravelIndicators />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
        <PodsDeliveredChart
          isLoading={travelStatsQuery.isFetching}
          data={travelStatsQuery.data}
        />

        <MonthProjectionChart />

        <div className="row-span-2">
          <TravelsByTrafficExecutive
            isLoading={travelStatsQuery.isFetching}
            data={travelStatsQuery.data}
          />
        </div>

        <ProjectionHistoryChart />
        <TravelsByConstruction
          isLoading={travelStatsQuery.isFetching}
          data={travelStatsQuery.data}
        />
        <TravelsByCargoType
          isLoading={travelStatsQuery.isFetching}
          data={travelStatsQuery.data}
        />
        <TravelsByCategoryChart
          isLoading={travelStatsQuery.isFetching}
          data={travelStatsQuery.data}
        />
        <MonthlyTravelsChart
          isLoading={travelStatsQuery.isFetching}
          data={travelStatsQuery.data}
        />
        <YearlyTravelsChart 
          isLoading={travelStatsQuery.isFetching}
          data={travelStatsQuery.data}
        />
        <div className="col-span-1 sm:col-span-2">
          <FrequentRoutesChart
            isLoading={travelStatsQuery.isFetching}
            data={travelStatsQuery.data}
          />
        </div>
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

export default TravelsDashboardPage;

