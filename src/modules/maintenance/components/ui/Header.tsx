import { useEffect, useState } from 'react';

import { HeaderBase } from '@/components/ui';
import { IndicatorCard } from '@/components/utils/IndicatorCard';
import { MaintenanceRecordStatus } from '../../models';
import { useMaintenanceRecord } from '../../hooks';

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
  } = useMaintenanceRecord("tractocamion", status);

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
    <HeaderBase backRoute="/reportes">
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
          content={branchCount?.veracruz || 0}
          isLoading={isFetchingRegisters}
        />
        <IndicatorCard
          title="Manzanillo"
          content={branchCount?.manzanillo || 0}
          isLoading={isFetchingRegisters}
        />
        <IndicatorCard
          title="México"
          content={branchCount?.mexico || 0}
          isLoading={isFetchingRegisters}
        />
        <IndicatorCard
          title="Pendientes"
          content={count?.pending || 0}
          isLoading={isFetching}
        />
        <IndicatorCard
          title="Completados"
          content={count?.completed || 0}
          isLoading={isFetching}
        />
        <IndicatorCard
          title="Programados"
          content={count?.programmed || 0}
          isLoading={isFetching}
        />
      </div>
    </HeaderBase>
  );
};

export default Header;

