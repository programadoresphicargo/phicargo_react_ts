import 'rsuite/dist/rsuite-no-reset.min.css';

import { useEffect, useState } from 'react';

import { getWeekRange } from '../utils/get-week-range';
import { useWeek } from '../hooks/useWeek';
import { useWeekContext } from '../hooks';
import type { DateRange } from 'rsuite/esm/DateRangePicker/types';
import DateRangePicker from 'rsuite/esm/DateRangePicker/DateRangePicker';

const WeekSelector = () => {
  const [value, setValue] = useState<DateRange | null>(null);

  const { onSetWeekSelected } = useWeekContext();

  const {
    changeWeekMutation: { mutate },
  } = useWeek();

  useEffect(() => {
    const [startOfWeek, endOfWeek] = getWeekRange();
    setValue([startOfWeek, endOfWeek]);
    onSetWeekSelected([startOfWeek, endOfWeek]);
    mutate({
      startDate: startOfWeek,
      endDate: endOfWeek,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeWeek = (week: DateRange | null) => {
    if (!week) return;
    setValue(week);
    onSetWeekSelected(week);
    mutate({
      startDate: week[0],
      endDate: week[1],
    });
  };

  return (
    <DateRangePicker
      oneTap
      showOneCalendar
      placeholder="Selecciona la semana"
      hoverRange="week"
      showWeekNumbers
      size="xs"
      isoWeek
      ranges={[]}
      style={{
        width: '100%',
      }}
      value={value}
      onChange={onChangeWeek}
    />
  );
};

export default WeekSelector;
