import { ClientsRevenueChart } from '../components/finance/ClientsRevenueChart';
import { RevenueByBranchChart } from '../components/finance/RevenueByBranchChart';
import { useWaybillStatsQueries } from '../hooks/useWaybillStatsQueries';

const FinanceDashbordPage = () => {
  const { waybillStatsQuery } = useWaybillStatsQueries();

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <RevenueByBranchChart
            isLoading={waybillStatsQuery.isFetching}
            data={waybillStatsQuery.data}
          />
        </div>
        <div className="lg:col-span-2">
          <ClientsRevenueChart
            isLoading={waybillStatsQuery.isFetching}
            data={waybillStatsQuery.data}
          />
        </div>
      </div>
    </div>
  );
};

export default FinanceDashbordPage;

