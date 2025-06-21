import { createContext } from 'react';
import type { DateRange } from 'rsuite/esm/DateRangePicker/types';

interface GlobalContextType {
  month: DateRange;
  setMonth: (mounth: DateRange | null) => void;
  branchId: number;
  setBranchId: (branchId: number) => void;
}

export const GlobalContext = createContext<GlobalContextType>(
  {} as GlobalContextType,
);
