import { ReportContext } from '../context/report-context/ReportContext';
import { useContext } from 'react';

/**
 * Custom hook para acceder al contexto de ReportContext
 * @returns Contexto de ReportContext
 */
export const useReportContext = () => {
  const context = useContext(ReportContext);

  return {
    ...context,
  };
};
