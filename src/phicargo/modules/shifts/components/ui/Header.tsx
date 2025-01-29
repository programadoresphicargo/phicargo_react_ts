import { Checkbox } from '@nextui-org/react';
import { HeaderBase } from '@/phicargo/modules/core/components/ui/HeaderBase';
import { HeaderCard } from '@/phicargo/modules/core/components/ui/HeaderCard';
import { RefreshButton } from '@/phicargo/modules/core/components/ui/RefreshButton';
import { useNavigate } from 'react-router-dom';
import { useShiftsContext } from '../../hooks/useShiftsContext';
import { useTravelQueries } from '../../hooks/useTravelQueries';

export const Header = () => {
  const navigate = useNavigate();
  const { branchId, setBranchId } = useShiftsContext();
  const {
    travelsInPlantQuery, 
    travelsUnloadingQuery,
    travelsNearQuery
  } = useTravelQueries();
  
  return (
    <HeaderBase onBack={() => navigate('/menu')}>
      <HeaderCard
        title="Descargando"
        isLoading={travelsUnloadingQuery.isFetching}
        content={travelsUnloadingQuery.data?.length || 0}
        infoButton
        onInfoClick={() => navigate('/turnos/unidades-descargando')}
        startContent={
          <RefreshButton 
            style={{ padding: 0 }} 
            onClick={() => travelsUnloadingQuery.refetch()}
            buttonClassName='text-emerald-400'
            isLoading={travelsUnloadingQuery.isPending}
          />
        }
      />
      <HeaderCard
        title="Bajando"
        isLoading={travelsNearQuery.isFetching}
        content={travelsNearQuery.data?.length || 0}
        infoButton
        onInfoClick={() => navigate('/turnos/unidades-bajando')}
        startContent={
          <RefreshButton
            style={{ padding: 0 }}   
            onClick={() => travelsNearQuery.refetch()}
            buttonClassName='text-emerald-400'
            isLoading={travelsNearQuery.isPending}
          />
        }
      />
      <HeaderCard
        title="Planta"
        isLoading={travelsInPlantQuery.isFetching}
        content={travelsInPlantQuery.data?.length || 0}
        infoButton
        onInfoClick={() => navigate('/turnos/unidades-planta')}
        startContent={
          <RefreshButton
            style={{ padding: 0 }}   
            onClick={() => travelsInPlantQuery.refetch()}
            buttonClassName='text-emerald-400'
            isLoading={travelsInPlantQuery.isPending}
          />
        }
      />
      <div className="flex flex-col gap-3">
        <div className="flex flex-row gap-2 bg-gray-700 py-1.5 px-2 rounded-xl">
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

