import CashflowLayout from '../Layout/CashflowLayout';

// import { TabOptions } from '../context/report-context/ReportContext';
// import { useReportContext } from '../hooks/useReportContext';

// import { Tabs } from 'rsuite';

const CashflowReportPage = () => {
  // const { activeReport, onActiveReportChange } = useReportContext();

  return (
    <CashflowLayout>
      <h1 className="text-2xl font-bold">Reporte de flujo de caja</h1>
    </CashflowLayout>
  );
};

export default CashflowReportPage;
