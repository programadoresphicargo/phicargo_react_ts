import 'rsuite/dist/rsuite-no-reset.min.css';

import { Button } from '@heroui/react';
import { CreateDayOffModal } from '@/phicargo/modules/core/components';
import { DateRangePicker } from 'rsuite';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useVehicleRevenueProjectionContext } from '../../hooks';

const { after } = DateRangePicker;

export const ConfigBar = () => {
  const { month, setMonth } = useVehicleRevenueProjectionContext();

  const [createDayOff, setCreateDayOff] = useState(false);

  return (
    <>
      <section>
        <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2">
          <Button
            color="primary"
            radius="full"
            onPress={() => setCreateDayOff(true)}
          >
            Registrar Día Inhabil
          </Button>
          <div className="">
            <DateRangePicker
              hoverRange="month"
              oneTap
              showOneCalendar
              placeholder="Selecciona Un Mes"
              format="dd/MM/yyyy"
              character=" - "
              showWeekNumbers
              value={month}
              onChange={setMonth}
              shouldDisableDate={after(
                dayjs().endOf('month').add(1, 'month').toDate(),
              )}
            />
          </div>
        </div>
      </section>
      <CreateDayOffModal
        open={createDayOff}
        onClose={() => setCreateDayOff(false)}
      />
    </>
  );
};

