import DailyReportLayout from '../layout/DailyReportLayout';
import GlobalProvider from '../context/GlobalProvider';
import ReportView from '../views/ReportView';

const DailyOperationsPage = () => {
  return (
    <GlobalProvider>
      <DailyReportLayout>
        <ReportView />
      </DailyReportLayout>
    </GlobalProvider>
  );
};

export default DailyOperationsPage;
