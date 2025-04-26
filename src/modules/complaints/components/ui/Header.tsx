import { HeaderBase } from '@/components/ui';
import { IndicatorCard } from '@/components/utils/IndicatorCard';

const Header = () => {
  return (
    <HeaderBase backRoute="/reportes">
      <div className="mx-8">
        <h1 className="m-0 p-0 text-xl text-gray-100 font-bold">
          No Conformidades
        </h1>
      </div>

      <div className="flex gap-2 flex-1">
        <IndicatorCard title="Abiertas" content={0} isLoading={false} />
        <IndicatorCard title="Cerradas" content={0} isLoading={false} />
        <IndicatorCard title="En Proceso" content={0} isLoading={false} />
      </div>
    </HeaderBase>
  );
};

export default Header;

