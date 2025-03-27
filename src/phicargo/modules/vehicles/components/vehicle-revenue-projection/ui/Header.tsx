import { HeaderBase } from '@/components/ui';
import { IndicatorCard } from '@/components/utils/IndicatorCard';

const Header = () => {
  return (
    <HeaderBase backRoute="/reportes">
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
          content={0}
        />
        <IndicatorCard
          title="Manzanillo"
          content={0}
        />
        <IndicatorCard
          title="México"
          content={0}
        />
      </div>
    </HeaderBase>
  );
};

export default Header;

