import { ConfigBar } from '../components/vehicle-revenue-projection/ConfigBar';
import VehicleRevenueProjectionLayout from '../layouts/VehicleRevenueProjectionLayout';
import { VehicleRevenueProjectionProvider } from '../context/VehicleRevenuProjectionContext';
import { VehicleRevenueProjectionTable } from '../components/vehicle-revenue-projection/VehicleRevenueProjectionTable';

const VehicleRevenueProjectionPage = () => {
  return (
    <VehicleRevenueProjectionProvider>
      <VehicleRevenueProjectionLayout>
        <ConfigBar />
        <VehicleRevenueProjectionTable />
      </VehicleRevenueProjectionLayout>
    </VehicleRevenueProjectionProvider>
  );
};

export default VehicleRevenueProjectionPage;

