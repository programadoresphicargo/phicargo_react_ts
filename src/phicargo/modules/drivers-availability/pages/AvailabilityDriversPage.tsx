import DriverTable from '../components/table/DriverTable';
import ManiobrasNavBar from '../../../maniobras/Navbar';
import { memo } from 'react';

const AvailabilityDriversPage = memo(() => {
  return (
    <>
      <ManiobrasNavBar />
      <DriverTable />
    </>
  );
});

export default AvailabilityDriversPage;
