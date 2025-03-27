import { VehicleRevenueProjectionByBranchTable } from './VehicleRevenueProjectionByBranchTable';
import { VehicleRevenueProjectionTable } from './VehicleRevenueProjectionTable';
import { useVehicleRevenueProjectionContext } from '../../hooks';

export const TableViews = () => {
  const { tabSelected } = useVehicleRevenueProjectionContext();

  return (
    <>
      {tabSelected === 'by-vehicle' && <VehicleRevenueProjectionTable />}
      {tabSelected === 'by-branch' && <VehicleRevenueProjectionByBranchTable />}
    </>
  );
};

