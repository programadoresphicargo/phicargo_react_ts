import dayjs from 'dayjs';
import { createContext, ReactNode, useState } from 'react';
import { DateRange } from 'rsuite/esm/DateRangePicker';

interface IncidentsContextState {
  dateRange: DateRange | null;
  setDateRange: (range: DateRange | null) => void;
}

const initialState: IncidentsContextState = {
  dateRange: null,
  setDateRange: () => {},
};

const IncidentsContext = createContext<IncidentsContextState>(initialState);

export const IncidentsProvider = ({ children }: { children: ReactNode }) => {
  const [dateRange, setDateRange] = useState<DateRange | null>([
    dayjs().startOf('month').toDate(),
    dayjs().endOf('month').toDate(),
  ]);

  return (
    <IncidentsContext.Provider value={{ dateRange, setDateRange }}>
      {children}
    </IncidentsContext.Provider>
  );
};

export default IncidentsContext;

