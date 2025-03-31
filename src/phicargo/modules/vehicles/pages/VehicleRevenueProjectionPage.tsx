import { ConfigBar } from '../components/vehicle-revenue-projection/ConfigBar';
import { TableViews } from '../components/vehicle-revenue-projection/TableViews';
import VehicleRevenueProjectionLayout from '../layouts/VehicleRevenueProjectionLayout';
import { VehicleRevenueProjectionProvider } from '../context/VehicleRevenuProjectionContext';

const VehicleRevenueProjectionPage = () => {
  return (
    <VehicleRevenueProjectionProvider>
      <VehicleRevenueProjectionLayout>
        <ConfigBar />
        <TableViews />
      </VehicleRevenueProjectionLayout>
    </VehicleRevenueProjectionProvider>
  );
};

export default VehicleRevenueProjectionPage;

