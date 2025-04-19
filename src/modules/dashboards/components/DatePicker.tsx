import { DateRangePicker } from '@/components/inputs';
import { DateRangePicker as RSDateRangePicker } from 'rsuite';
import { RefreshButton } from '@/components/ui';
import dayjs from 'dayjs';
import { useDateRangeContext } from '../hooks/useDateRangeContext';
import { useRefetchFn } from '../hooks/useRefetchFn';

const { after } = RSDateRangePicker;

export const DatePicker = () => {
  const { month, setMonth } = useDateRangeContext();

  const refetchFn = useRefetchFn();

  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="flex flex-row gap-2 border-2 items-center border-slate-300 bg-white rounded-xl p-1 shadow-md">
        <div className="flex flex-row items-center rounded-xl">
          <RefreshButton onRefresh={() => refetchFn()} />
        </div>
        <DateRangePicker
          oneTap
          showOneCalendar
          placeholder={`Selecciona el rango de fechas`}
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

