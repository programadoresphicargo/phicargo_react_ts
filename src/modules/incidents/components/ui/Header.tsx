import { HeaderBase } from '@/components/ui';

import { IndicatorCard } from '@/components/utils/IndicatorCard';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();

  return (
    <HeaderBase backRoute="/menu">
      <div className="flex flex-auto gap-2 mx-2">
        <IndicatorCard
          title="Descargando"
          isLoading={false}
          content={0}
          infoButton
          onInfoClick={() => navigate('/turnos/unidades-descargando')}
        />
        <IndicatorCard
          title="Bajando"
          isLoading={false}
          content={0}
          infoButton
          onInfoClick={() => navigate('/turnos/unidades-bajando')}
        />
        <IndicatorCard
          title="Planta"
          isLoading={false}
          content={0}
          infoButton
          onInfoClick={() => navigate('/turnos/unidades-planta')}
        />
      </div>
      <div className="flex flex-col gap-3"></div>
    </HeaderBase>
  );
};

