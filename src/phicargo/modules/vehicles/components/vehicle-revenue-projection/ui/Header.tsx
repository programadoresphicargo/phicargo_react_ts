import { HeaderBase } from '@/components/ui';
import { IndicatorCard } from '@/components/utils/IndicatorCard';
import { formatCurrency } from '@/utilities';
import { useGetVehicleRevenueProjectionQuery } from '../../../hooks/queries';

const Header = () => {
  const {
    getVehicleRevenueProjectionByBranchQuery: { data, isFetching },
  } = useGetVehicleRevenueProjectionQuery();

  const veracruz = data?.find((item) => item.branch === 'VER');
  const manzanillo = data?.find((item) => item.branch === 'MZN');
  const mexico = data?.find((item) => item.branch === 'MEX');

  return (
    <HeaderBase backRoute="/reportes" fixed>
      <div className="mx-8">
        <h1 className="m-0 p-0 text-xl text-gray-100 font-bold">
          Proyección Mensual
        </h1>
        <p className="my-1 text-sm text-gray-300">
          Reporte de proyección mensual por unidad.
        </p>
      </div>

      <div className="flex gap-2 flex-1">
        <IndicatorCard
          title="Veracruz"
          content={
            <CardContent
              real={veracruz?.realMonthlyRevenue ?? 0}
              ideal={veracruz?.idealMonthlyRevenue ?? 0}
            />
          }
          isLoading={isFetching}
        />
        <IndicatorCard
          title="Manzanillo"
          content={
            <CardContent
              real={manzanillo?.realMonthlyRevenue ?? 0}
              ideal={manzanillo?.idealMonthlyRevenue ?? 0}
            />
          }
          isLoading={isFetching}
        />
        <IndicatorCard
          title="México"
          content={
            <CardContent
              real={mexico?.realMonthlyRevenue ?? 0}
              ideal={mexico?.idealMonthlyRevenue ?? 0}
            />
          }
          isLoading={isFetching}
        />
      </div>
    </HeaderBase>
  );
};

export default Header;

const CardContent = ({ real, ideal }: { real: number; ideal: number }) => {
  return (
    <>
      <span
        className={`
          px-2 py-1 rounded font-semibold font-mono
          ${real >= ideal ? 'text-green-700 bg-green-50' : ''}
          ${real < ideal ? 'text-red-400' : ''}
            `}
      >
        {formatCurrency(real)}
      </span>
      {'-> '}
      <span className="font-semibold font-mono">{formatCurrency(ideal)}</span>
    </>
  );
};

