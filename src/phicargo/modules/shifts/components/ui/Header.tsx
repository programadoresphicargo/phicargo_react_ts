import { Checkbox } from '@nextui-org/react';
import { HeaderBase } from '@/phicargo/modules/core/components/ui/HeaderBase';
import { useNavigate } from 'react-router-dom';
import { useShiftsContext } from '../../hooks/useShiftsContext';

export const Header = () => {
  const navigate = useNavigate();
  const { branchId, setBranchId } = useShiftsContext();

  return (
    <HeaderBase onBack={() => navigate('/menu')}>
      <h1 className="text-2xl font-semibold">Turnos</h1>
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

