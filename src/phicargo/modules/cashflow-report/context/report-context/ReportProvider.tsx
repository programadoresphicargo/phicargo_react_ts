import { ReportContext, TabOptions } from './ReportContext';

import { useState } from 'react';

interface ReportProviderProps {
  children: React.ReactNode;
}

const ReportProvider = ({ children }: ReportProviderProps) => {
  const [activeKey, setActiveKey] = useState<TabOptions>('collect');

  const onActiveReportChange = (report: TabOptions) => {
    setActiveKey(report);
  };

  return (
    <ReportContext.Provider
      value={{
        activeReport: activeKey,
        onActiveReportChange: onActiveReportChange,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export default ReportProvider;
