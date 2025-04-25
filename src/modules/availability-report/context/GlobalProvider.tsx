import type { DateRange } from 'rsuite/esm/DateRangePicker';
import { GlobalContext } from './GlobalContext';
import dayjs from 'dayjs';
import { useState } from 'react';

interface GlobalProviderProps {
  children: React.ReactNode;
}

const branchVeracruz = 1;

const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [value, setValue] = useState<DateRange>([
    dayjs().startOf('month').toDate(),
    dayjs().endOf('month').toDate(),
  ]);

  const [branchId, setBranchId] = useState<number>(branchVeracruz);

  const setMonth = (mounth: DateRange | null) => {
    if (mounth) setValue(mounth);
  };

  const onBranchChange = (branchId: number | string) => {
    setBranchId(Number(branchId));
  };

  return (
    <GlobalContext.Provider
      value={{
        month: value,
        setMonth,
        branchId,
        setBranchId: onBranchChange,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
