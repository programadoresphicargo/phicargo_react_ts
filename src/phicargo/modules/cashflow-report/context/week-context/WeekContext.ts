import { DateRange } from 'rsuite/esm/DateRangePicker';
import { createContext } from 'react';

export interface WeekContextProps {
  activeWeekId: number | null;
  onChangeWeek: (weekId: number) => void;
  weekSelected: DateRange | null;
  onSetWeekSelected: (week: DateRange) => void;
}

export const WeekContext = createContext<WeekContextProps>(
  {} as WeekContextProps,
);