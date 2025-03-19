import { Checkbox } from '@heroui/react';
import { HeaderBase } from '@/phicargo/modules/core/components/ui/HeaderBase';
import { IndicatorCard } from '@/components/utils/IndicatorCard';
import { RefreshButton } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { useShiftsContext } from '../../hooks/useShiftsContext';
import { useTravelQueries } from '../../hooks/useTravelQueries';

export const Header = () => {
  const navigate = useNavigate();
  const { branchId, setBranchId } = useShiftsContext();
  const { travelsInPlantQuery, travelsUnloadingQuery, travelsNearQuery } =
    useTravelQueries();

  return (
    <HeaderBase backRoute="/menu">
      <IndicatorCard
        title="Descargando"
        isLoading={travelsUnloadingQuery.isFetching}
        content={travelsUnloadingQuery.data?.length || 0}
        infoButton
        onInfoClick={() => navigate('/turnos/unidades-descargando')}
        startContent={
          <RefreshButton
            onRefresh={() => travelsUnloadingQuery.refetch()}
            isLoading={travelsUnloadingQuery.isPending}
          />
        }
      />
      <IndicatorCard
        title="Bajando"
        isLoading={travelsNearQuery.isFetching}
        content={travelsNearQuery.data?.length || 0}
        infoButton
        onInfoClick={() => navigate('/turnos/unidades-bajando')}
        startContent={
          <RefreshButton
            onRefresh={() => travelsNearQuery.refetch()}
            isLoading={travelsNearQuery.isPending}
          />
        }
      />
      <IndicatorCard
        title="Planta"
        isLoading={travelsInPlantQuery.isFetching}
        content={travelsInPlantQuery.data?.length || 0}
        infoButton
        onInfoClick={() => navigate('/turnos/unidades-planta')}
        startContent={
          <RefreshButton
            onRefresh={() => travelsInPlantQuery.refetch()}
            isLoading={travelsInPlantQuery.isPending}
          />
        }
      />
      <div className="flex flex-col gap-3">
        <div className="flex flex-row gap-2 bg-gray-200/20 backdrop-blur-sm py-1.5 px-2 rounded-xl">
          <Checkbox
            isSelected={branchId === 1}
            onValueChange={() => setBranchId(1)}
            classNames={{ label: 'text-white uppercase' }}
            size="sm"
          >
            VER
          </Checkbox>
          <Checkbox
            isSelected={branchId === 9}
            onValueChange={() => setBranchId(9)}
            classNames={{ label: 'text-white uppercase' }}
            size="sm"
          >
            MZN
          </Checkbox>
          <Checkbox
            isSelected={branchId === 2}
            onValueChange={() => setBranchId(2)}
            classNames={{ label: 'text-white uppercase' }}
            size="sm"
          >
            MEX
          </Checkbox>
        </div>
      </div>
    </HeaderBase>
  );
};

