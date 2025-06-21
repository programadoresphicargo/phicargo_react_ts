import { createContext } from 'react';
import type { DateRange } from 'rsuite/esm/DateRangePicker/types';

export interface WeekContextProps {
  activeWeekId: number | null;
  onChangeWeek: (weekId: number) => void;
  weekSelected: DateRange | null;
  onSetWeekSelected: (week: DateRange) => void;

  companySelected: number;
  onCompanyChange: (companyId: number) => void;
}

export const WeekContext = createContext<WeekContextProps>(
  {} as WeekContextProps,
);
