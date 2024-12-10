import { createContext } from 'react';

export type TabOptions = 'collect' | 'pay';

export interface ReportContextProps {
  activeReport: TabOptions;
  onActiveReportChange: (report: TabOptions) => void;
}

export const ReportContext = createContext<ReportContextProps>(
  {} as ReportContextProps,
);
