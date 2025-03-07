import { useEffect, useState } from 'react';

import { BackButton } from '@/components/ui/BackButton';
import { IndicatorCard } from '@/components/utils/IndicatorCard';
import { MaintenanceRecordStatus } from '../models';
import { useMaintenanceRecord } from '../hooks';

interface Props {
  status: MaintenanceRecordStatus;
}

type BranchCount = {
  mexico: number;
  manzanillo: number;
  veracruz: number;
};

const defaultBranchCount: BranchCount = {
  mexico: 0,
  manzanillo: 0,
  veracruz: 0,
};

const BRANCH_IDS = {
  mexico: 2,
  manzanillo: 9,
  veracruz: 1,
};

const Header = (props: Props) => {
  const { status } = props;

  const [branchCount, setBranchCount] =
    useState<BranchCount>(defaultBranchCount);

  const {
    recordsCountQuery: { data: count, isFetching },
    recordsQuery: { data: registers, isFetching: isFetchingRegisters },
  } = useMaintenanceRecord(status);

  useEffect(() => {
    if (!isFetchingRegisters && registers) {
      const veracruz = registers.filter(
        (r) => r?.vehicle?.branch?.id === BRANCH_IDS.veracruz,
      ).length;
      const manzanillo = registers.filter(
        (r) => r?.vehicle?.branch?.id === BRANCH_IDS.manzanillo,
      ).length;
      const mexico = registers.filter(
        (r) => r?.vehicle?.branch?.id === BRANCH_IDS.mexico,
      ).length;
      setBranchCount({
        veracruz,
        manzanillo,
        mexico,
      });
    }
  }, [isFetchingRegisters, registers]);

  return (
    <div
      className="max-w-full mx-auto text-white px-4 py-2 flex flex-col"
      style={{
        // background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 400"><rect width="1920" height="400" fill="%23D9DEEA" /><mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="400"><rect width="1920" height="400" fill="%23D9DEEA" /></mask><g mask="url(%23mask0)"><path d="M1059.48 308.024C1152.75 57.0319 927.003 -103.239 802.47 -152.001L1805.22 -495.637L2095.53 351.501L1321.23 616.846C1195.12 618.485 966.213 559.015 1059.48 308.024Z" fill="%23C0CBDD" /><path d="M1333.22 220.032C1468.66 -144.445 1140.84 -377.182 960 -447.991L2416.14 -947L2837.71 283.168L1713.32 668.487C1530.19 670.868 1197.78 584.509 1333.22 220.032Z" fill="%238192B0" /></g></svg>')`,
        // backgroundSize: 'cover',
        // backgroundPosition: 'center',
        background: 'linear-gradient(90deg, #0b2149, #002887)',
      }}
    >
      <div className="flex justify-between items-center flex-wrap">
        <BackButton route="/reportes" />

        <div className="mx-8">
          <h1 className="m-0 p-0 text-xl text-gray-100 font-bold">
            Reporte de Mantenimiento
          </h1>
          <p className="my-1 text-sm text-gray-300">
            Información sobre el estado de los tractos en mantenimiento.
          </p>
        </div>

        <div className="flex gap-2 flex-1">
          <IndicatorCard
            title="Veracruz"
            content={isFetchingRegisters ? '...' : branchCount?.veracruz || 0}
          />
          <IndicatorCard
            title="Manzanillo"
            content={isFetchingRegisters ? '...' : branchCount?.manzanillo || 0}
          />
          <IndicatorCard
            title="México"
            content={isFetchingRegisters ? '...' : branchCount?.mexico || 0}
          />
          <IndicatorCard
            title="Pendientes"
            content={isFetching ? '...' : count?.pending || 0}
          />
          <IndicatorCard
            title="Completados"
            content={isFetching ? '...' : count?.completed || 0}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
