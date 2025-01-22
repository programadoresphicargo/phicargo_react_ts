import { ReactNode, createContext, useMemo, useState } from 'react';

import { DateRange } from 'rsuite/esm/DateRangePicker';
import dayjs from '../../core/utilities/dayjs-config';

type DateRangeString = {
  start: string;
  end: string;
};

interface DateRangeContextProps {
  month: DateRange | null;
  setMonth: (month: DateRange | null) => void;
  monthString: DateRangeString | null;
  monthYearName?: string;

  companyId: number | null; 
  setCompanyId: (companyId: number | null) => void;

  branchId: number | null;
  setBranchId: (branchId: number | null) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const DateRangeContext = createContext<DateRangeContextProps>(
  {} as DateRangeContextProps,
);

interface Props {
  children: ReactNode;
}

export const DateRangeProvider = ({ children }: Props) => {
  const [month, setMonth] = useState<DateRange | null>([
    dayjs().startOf('month').toDate(),
    dayjs().endOf('month').toDate(),
  ]);

  const [monthString, setMonthString] = useState<DateRangeString>({
    start: dayjs().startOf('month').format('YYYY-MM-DD'),
    end: dayjs().endOf('month').format('YYYY-MM-DD'),
  });

  const [companyId, setCompanyId] = useState<number | null>(null);
  const [branchId, setBranchId] = useState<number | null>(null);

  const onMonthChange = (month: DateRange | null) => {
    setMonth(month);
    if (!month) {
      return;
    }
    setMonthString({
      start: dayjs(month[0]).format('YYYY-MM-DD'),
      end: dayjs(month[1]).format('YYYY-MM-DD'),
    });
  };

  const monthYearName = useMemo(() => {
    if (!month) return '';
    return dayjs(month[0]).format('MMMM YYYY');
  }, [month]);

  return (
    <DateRangeContext.Provider
      value={{
        month,
        setMonth: onMonthChange,
        monthString,
        monthYearName,

        companyId,
        setCompanyId,
        branchId,
        setBranchId,
      }}
    >
      {children}
    </DateRangeContext.Provider>
  );
};

