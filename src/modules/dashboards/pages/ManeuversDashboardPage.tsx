import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
import { ManeuversByDriverChart } from '../components/maneuvers/ManeuversByDriverChart';
import { ManeuversByTeminalChart } from '../components/maneuvers/ManeuversByTeminalChart';
import { ManeuversLateSummaryChart } from '../components/maneuvers/ManeuversLateSummaryChart';
import { useManeuversStatsQueries } from '../hooks/useManeuversStatsQueries';

Chart.register(CategoryScale);

const ManeuversDashboardPage = () => {
  const { maneuversStatsQuery } = useManeuversStatsQueries();

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        <ManeuversByDriverChart
          isLoading={maneuversStatsQuery.isFetching}
          data={maneuversStatsQuery.data}
          job="operator"
        />
        <ManeuversByDriverChart
          isLoading={maneuversStatsQuery.isFetching}
          data={maneuversStatsQuery.data}
          job="mover"
        />
        <ManeuversByTeminalChart
          isLoading={maneuversStatsQuery.isFetching}
          data={maneuversStatsQuery.data}
        />
        <ManeuversLateSummaryChart
          isLoading={maneuversStatsQuery.isFetching}
          data={maneuversStatsQuery.data}
        />
      </div>
    </div>
  );
};

export default ManeuversDashboardPage;

