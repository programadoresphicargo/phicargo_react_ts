import 'rsuite/dist/rsuite-no-reset.min.css';

import { IconButton, Tooltip } from '@mui/material';

import { DateRangePicker } from 'rsuite';
import { FaCalendar } from 'react-icons/fa6';
import { FaCalendarWeek } from 'react-icons/fa6';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Switch } from '@heroui/react';
import dayjs from 'dayjs';
import { useDateRangeContext } from '../hooks/useDateRangeContext';
import { useRefetchFn } from '../hooks/useRefetchFn';
import { useState } from 'react';

const { after } = DateRangePicker;

export const DatePicker = () => {
  const { month, setMonth } = useDateRangeContext();

  const [calendarMode, setCalendarMode] = useState(false);

  const refetchFn = useRefetchFn();

  return (
    <div className="flex flex-row gap-4 items-center">
      <Switch
        isSelected={calendarMode}
        onValueChange={setCalendarMode}
        thumbIcon={({ isSelected }) =>
          isSelected ? (
            <FaCalendarWeek className="text-blue-500" />
          ) : (
            <FaCalendar className="text-blue-500" />
          )
        }
      />
      <div className="flex flex-row gap-2 border-2 items-center border-slate-300 bg-white rounded-xl p-1 shadow-md">
        <div className="flex flex-row items-center rounded-xl">
          <Tooltip arrow title="Refrescar">
            <IconButton size="small" onClick={() => refetchFn()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </div>
        <DateRangePicker
          hoverRange={calendarMode ? 'week' : 'month'}
          oneTap
          showOneCalendar
          placeholder={`Selecciona ${calendarMode ? 'semana' : 'mes'}`}
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

