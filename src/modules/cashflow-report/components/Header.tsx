import { Checkbox, Tab, Tabs } from '@heroui/react';
import { useLoadPrevious, useWeekContext } from '../hooks';

import { AlertDialog } from '@/components';
import { HeaderBase } from '@/components/ui';
import HeaderCards from './HeaderCards';
import WeekSelector from './WeekSelector';
import { isSameWeek } from '../utils';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const { activeWeekId, weekSelected, companySelected, onCompanyChange } =
    useWeekContext();
  const { loadPrevious } = useLoadPrevious();

  const [loadPreviousConfirm, setLoadPreviousConfirm] = useState(false);

  const onLoadPreviousWeek = () => {
    if (!weekSelected || !activeWeekId) return;
    loadPrevious();
    setLoadPreviousConfirm(false);
  };

  return (
    <>
      <HeaderBase backRoute="/reportes">
        <div className="flex flex-col gap-1 bg-gray-200/20 backdrop-blur-sm mx-4 py-1.5 px-2 rounded-xl">
          <Checkbox
            isSelected={companySelected === 1}
            onValueChange={() => onCompanyChange(1)}
            classNames={{ label: 'text-white uppercase text-xs' }}
            size="sm"
          >
            Belchez
          </Checkbox>
          <hr className="border-t border-gray-600" />
          <Checkbox
            isSelected={companySelected === 2}
            onValueChange={() => onCompanyChange(2)}
            classNames={{
              label: 'text-white uppercase text-xs',
            }}
            size="sm"
          >
            Phicargo
          </Checkbox>
        </div>

        <div className="flex flex-col items-start mr-4 gap-2">
          <Tabs
            aria-label="Options"
            isVertical
            variant="solid"
            color="primary"
            size="sm"
            onSelectionChange={(e) => navigate(`/reportes/balance/${e}`)}
          >
            <Tab key="collect" title="Cobro" />
            <Tab key="payment" title="Cuentas por pagar" />
          </Tabs>
        </div>

        <div className="flex bg-gray-200/20 backdrop-blur-sm mr-4 py-1.5 px-2 rounded-xl flex-col gap-2 w-1/6 min-w-[150px]">
          <WeekSelector />
          <AlertDialog
            open={loadPreviousConfirm}
            onOpenChange={setLoadPreviousConfirm}
            openButtonText={'Traer Anteriores'}
            buttonVariant="solid"
            severity={'warning'}
            title={'¿Confirmar la carga?'}
            message={
              '¿Estás seguro cargar los pagos pendientes de la semana pasada?'
            }
            onConfirm={onLoadPreviousWeek}
            openDisabled={!isSameWeek(weekSelected!)}
            tooltipMessage={'Traer Anteriores'}
          />
        </div>

        <div className="flex gap-4 flex-wrap justify-center flex-1">
          <HeaderCards />
        </div>
      </HeaderBase>
    </>
  );
};

export default Header;

