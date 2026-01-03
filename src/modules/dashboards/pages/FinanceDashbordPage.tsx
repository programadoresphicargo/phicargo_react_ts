import { ClientsRevenueChart } from '../components/finance/ClientsRevenueChart';
import { MonthlyContainersCountChart } from '../components/finance/MonthlyContainersCountChart';
import { MonthlyRevenueChart } from '../components/finance/MonthlyRevenueChart';
import { RevenueByBranchChart } from '../components/finance/RevenueByBranchChart';
import { YearlyContainersCountChart } from '../components/finance/YearlyContainersCountChart';
import { YearlyRevenueChart } from '../components/finance/YearlyRevenueChart';
import { useWaybillStatsQueries } from '../hooks/useWaybillStatsQueries';
import ReporteIngresosClientes from './report';

const FinanceDashbordPage = () => {
  const { waybillStatsQuery } = useWaybillStatsQueries();

  return (
    <section className="p-4">
      <ReporteIngresosClientes></ReporteIngresosClientes>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RevenueByBranchChart
          isLoading={waybillStatsQuery.isFetching}
          data={waybillStatsQuery.data}
        />
        <MonthlyRevenueChart
          isLoading={waybillStatsQuery.isFetching}
          data={waybillStatsQuery.data}
        />
        <YearlyRevenueChart
          isLoading={waybillStatsQuery.isFetching}
          data={waybillStatsQuery.data}
        />
        <MonthlyContainersCountChart
          isLoading={waybillStatsQuery.isFetching}
          data={waybillStatsQuery.data}
        />
        <YearlyContainersCountChart
          isLoading={waybillStatsQuery.isFetching}
          data={waybillStatsQuery.data}
        />

        <div className="lg:col-span-3">
          <ClientsRevenueChart
            isLoading={waybillStatsQuery.isFetching}
            data={waybillStatsQuery.data}
          />
        </div>
      </div>
    </section>
  );
};

export default FinanceDashbordPage;

