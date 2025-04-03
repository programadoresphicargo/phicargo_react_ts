import { DateRange } from 'rsuite/esm/DateRangePicker';
import { WeekContext } from './WeekContext';
import { useState } from 'react';

interface WeekProviderProps {
  children: React.ReactNode;
}

const WeekProvider = ({ children }: WeekProviderProps) => {
  const [activeWeekId, setActiveWeekId] = useState<number | null>(null);
  const [weekSelected, setWeekSelected] = useState<DateRange | null>(null);

  const [companySelected, setCompanySelected] = useState<number>(1);

  const onCompanyChange = (companyId: number) => {
    setCompanySelected(companyId);
  };

  const onChangeWeek = (weekId: number) => {
    setActiveWeekId(weekId);
  };

  const onSetWeekSelected = (week: DateRange) => {
    setWeekSelected(week);
  };

  return (
    <WeekContext.Provider
      value={{
        activeWeekId: activeWeekId,
        onChangeWeek: onChangeWeek,
        weekSelected: weekSelected,
        onSetWeekSelected: onSetWeekSelected,
        companySelected,
        onCompanyChange,
      }}
    >
      {children}
    </WeekContext.Provider>
  );
};

export default WeekProvider;
