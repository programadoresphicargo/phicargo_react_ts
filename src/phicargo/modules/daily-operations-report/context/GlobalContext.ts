import { DateRange } from 'rsuite/esm/DateRangePicker';
import { createContext } from 'react';

interface GlobalContextType {
  month: DateRange;
  setMonth: (mounth: DateRange | null) => void;
  branchId: number;
  setBranchId: (branchId: number) => void;
}

export const GlobalContext = createContext<GlobalContextType>(
  {} as GlobalContextType,
);
