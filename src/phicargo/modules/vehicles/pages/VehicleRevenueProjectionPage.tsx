import { ConfigBar } from '../components/vehicle-revenue-projection/ConfigBar';
import { Outlet } from 'react-router-dom';
import VehicleRevenueProjectionLayout from '../layouts/VehicleRevenueProjectionLayout';
import { VehicleRevenueProjectionProvider } from '../context/VehicleRevenuProjectionContext';
import { VehicleRevenueProjectionTable } from '../components/vehicle-revenue-projection/VehicleRevenueProjectionTable';

const VehicleRevenueProjectionPage = () => {
  return (
    <VehicleRevenueProjectionProvider>
      <VehicleRevenueProjectionLayout>
        <ConfigBar />
        <VehicleRevenueProjectionTable />
        <Outlet />
      </VehicleRevenueProjectionLayout>
    </VehicleRevenueProjectionProvider>
  );
};

export default VehicleRevenueProjectionPage;

