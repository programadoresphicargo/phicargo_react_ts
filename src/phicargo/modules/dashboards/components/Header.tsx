import 'rsuite/dist/rsuite-no-reset.min.css';

import { IconButton, Tooltip } from '@mui/material';
import { Tab, Tabs } from '@nextui-org/react';

import { DateRangePicker } from 'rsuite';
import RefreshIcon from '@mui/icons-material/Refresh';
import dayjs from 'dayjs';
import { useDateRangeContext } from '../hooks/useDateRangeContext';
import { useTravelStatsQueries } from '../hooks/useTravelStatsQueries';

const { after } = DateRangePicker;

export const Header = () => {
  const { month, setMonth } = useDateRangeContext();
  const { travelStatsQuery } = useTravelStatsQueries();

  return (
    <div className="mb-4 flex justify-between items-center">
      <Tabs aria-label="dashboards" size='sm' color='primary' variant='bordered'>
        <Tab key="operations" title="Operaciones" />
        <Tab key="late-arrives" title="Llegadas Tarde" />
      </Tabs>
      <div className="flex flex-row gap-2 border-2 items-center border-slate-300 rounded-xl p-1 shadow-md">
        <div className="flex flex-row items-center rounded-xl">
          <Tooltip arrow title="Refrescar">
            <IconButton size="small" onClick={() => travelStatsQuery.refetch()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </div>
        <DateRangePicker
          hoverRange="month"
          oneTap
          showOneCalendar
          placeholder="Selecciona Un Mes"
          size="sm"
          format="dd/MM/yyyy"
          character=" - "
          showWeekNumbers
          value={month}
          onChange={setMonth}
          shouldDisableDate={after(dayjs().endOf('month').toDate())}
        />
      </div>
    </div>
  );
};

