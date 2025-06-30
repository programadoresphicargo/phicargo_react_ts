import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { VehicleInspection } from '@/modules/vehicles/models';

interface Props {
  inspectionType?: string;
  vehicleInspections: VehicleInspection[];
}

export const VehicleInspectionHeader = ({ vehicleInspections, inspectionType }: Props) => {
  const totalUnits = vehicleInspections.length;
  const reviewedUnits = vehicleInspections.filter((v) => v.inspection).length;
  const pendingUnits = vehicleInspections.filter((v) => !v.inspection).length;

  return (
    <div className="bg-gray-200 px-3 py-1 shadow-sm w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 className="tracking-tight font-semibold lg:text-2xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text">
          Revisiones de Unidades {inspectionType && `(${inspectionType})`}
        </h1>
        <p className="text-gray-600">
          Aquí puedes ver y gestionar las revisiones de las unidades.
        </p>
      </div>
      <div className="flex gap-3">
        <div className="bg-white rounded-lg shadow flex items-center gap-2 px-4 py-2 min-w-[120px]">
          <DirectionsBusIcon className="text-blue-700" />
          <div>
            <div className="text-lg font-bold">{totalUnits}</div>
            <div className="text-xs text-gray-500">Total unidades</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow flex items-center gap-2 px-4 py-2 min-w-[120px]">
          <CheckCircleIcon className="text-green-600" />
          <div>
            <div className="text-lg font-bold">{reviewedUnits}</div>
            <div className="text-xs text-gray-500">Revisadas</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow flex items-center gap-2 px-4 py-2 min-w-[120px]">
          <PendingActionsIcon className="text-yellow-600" />
          <div>
            <div className="text-lg font-bold">{pendingUnits}</div>
            <div className="text-xs text-gray-500">Pendientes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

