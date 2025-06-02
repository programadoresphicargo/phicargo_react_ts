import dayjs from 'dayjs';
import { createContext, ReactNode, useState } from 'react';
import { DateRange } from 'rsuite/esm/DateRangePicker';

interface IncidentsContextState {
  dateRange: DateRange | null;
  setDateRange: (range: DateRange | null) => void;
  formatedDateRange: { startDate: string; endDate: string };
}

const initialState: IncidentsContextState = {
  dateRange: null,
  setDateRange: () => {},
  formatedDateRange: { startDate: '', endDate: '' },
};

const IncidentsContext = createContext<IncidentsContextState>(initialState);

export const IncidentsProvider = ({ children }: { children: ReactNode }) => {
  const [dateRange, setDateRange] = useState<DateRange | null>([
    dayjs().startOf('month').toDate(),
    dayjs().endOf('month').toDate(),
  ]);

  const formatedDateRange = {
    startDate: dayjs(dateRange?.[0]).format('YYYY-MM-DD'),
    endDate: dayjs(dateRange?.[1]).format('YYYY-MM-DD'),
  };

  return (
    <IncidentsContext.Provider value={{ dateRange, setDateRange, formatedDateRange }}>
      {children}
    </IncidentsContext.Provider>
  );
};

export default IncidentsContext;

