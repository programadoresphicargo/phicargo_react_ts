import 'rsuite/dist/rsuite-no-reset.min.css';

import { Button, Tab, Tabs } from '@heroui/react';
import { DatePicker, DateRangePicker } from 'rsuite';

import { CreateDayOffModal } from '@/modules/core/components';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useVehicleRevenueProjectionContext } from '../../hooks';

const { after } = DateRangePicker;

export const ConfigBar = () => {
  const { month, setMonth, tabSelected, setTabSelected, snapshotDate, setSnapshotDate } =
    useVehicleRevenueProjectionContext();

  const [createDayOff, setCreateDayOff] = useState(false);

  return (
    <>
      <section>
        <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2">
          <Tabs
            aria-label="Options"
            color="primary"
            selectedKey={tabSelected}
            onSelectionChange={(key) => setTabSelected(key as string)}
          >
            <Tab key="by-vehicle" title="POR VEHICULO" />
            <Tab key="by-branch" title="POR SUCURSAL" />
          </Tabs>

          <div className="flex items-center gap-2">
            <DatePicker 
              placeholder="Historial"
              format="dd/MM/yyyy" 
              showWeekNumbers
              value={snapshotDate} 
              onChange={setSnapshotDate}
            />
            <Button
              color="primary"
              radius="full"
              size="sm"
              className="font-bold"
              onPress={() => setCreateDayOff(true)}
            >
              Registrar Día Inhabil
            </Button>
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

