import { BasicTextCell } from '@/components/ui';
import { IoMdInformationCircle } from 'react-icons/io';
import type { Maneuver } from '../../models';
import { ManeuversListModal } from '../ManeuversListModal';
import { useState } from 'react';

interface Props {
  value: string | number;
  maneuvers: Maneuver[];
}

export const ManeuversCell = ({ maneuvers, value }: Props) => {
  const [openStatus, setOpenStatus] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <BasicTextCell
          value={value}
          className="block font-bold uppercase text-indigo-600"
          fallback="0"
        />
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setOpenStatus(true)}
        >
          <IoMdInformationCircle className="w-5 h-5" />
        </button>
      </div>
      <ManeuversListModal
        open={openStatus}
        onClose={() => setOpenStatus(false)}
        maneuvers={maneuvers}
      />
    </>
  );
};

