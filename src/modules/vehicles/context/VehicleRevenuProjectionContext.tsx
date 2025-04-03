import { ReactNode, createContext, useState } from 'react';

import { DateRange } from 'rsuite/esm/DateRangePicker';
import dayjs from 'dayjs';

interface VehicleRevenueProjectionContextType {
  month: DateRange | null;
  setMonth: (mounth: DateRange | null) => void;

  snapshotDate: Date | null;
  setSnapshotDate: (date: Date | null) => void;

  tabSelected: string;
  setTabSelected: (tab: string) => void;
}

const VehicleRevenueProjectionContext =
  createContext<VehicleRevenueProjectionContextType>(
    {} as VehicleRevenueProjectionContextType,
  );

export const VehicleRevenueProjectionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [value, setValue] = useState<DateRange>([
    dayjs().startOf('month').toDate(),
    dayjs().endOf('month').toDate(),
  ]);

  const [snapshotDate, setSnapshotDate] = useState<Date | null>(null);

  const [tabSelected, setTabSelected] = useState("by-vehicle");

  const setMonth = (mounth: DateRange | null) => {
    if (mounth) setValue(mounth);
  };

  return (
    <VehicleRevenueProjectionContext.Provider
      value={{
        month: value,
        setMonth,
        snapshotDate,
        setSnapshotDate,
        tabSelected,
        setTabSelected
      }}
    >
      {children}
    </VehicleRevenueProjectionContext.Provider>
  );
};

export default VehicleRevenueProjectionContext;

