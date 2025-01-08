import { Checkbox } from '@nextui-org/react';
import { HeaderBase } from '@/phicargo/modules/core/components/ui/HeaderBase';
import { HeaderCard } from '@/phicargo/modules/core/components/ui/HeaderCard';
import { useNavigate } from 'react-router-dom';
import { useShiftsContext } from '../../hooks/useShiftsContext';

export const Header = () => {
  const navigate = useNavigate();
  const { branchId, setBranchId } = useShiftsContext();
  
  return (
    <HeaderBase onBack={() => navigate('/menu')}>
      <HeaderCard
        title="Descargando"
        content="23"
        infoButton
        onInfoClick={() => navigate('/turnos/unidades-descargando')}
      />
      <HeaderCard
        title="Bajando"
        content="23"
        infoButton
        onInfoClick={() => navigate('/turnos/unidades-bajando')}
      />
      <HeaderCard
        title="Planta"
        content="23"
        infoButton
        onInfoClick={() => navigate('/turnos/unidades-planta')}
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

