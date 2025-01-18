import { CellInfoPopover } from "./CellInfoPopover";
import { TravelSimple } from "../../../core/models";
import { memo } from "react";

interface Props {
  travel?: TravelSimple | null;
}

export const TravelCell = memo(({ travel }: Props) => {
  return (
    <div className="flex flex-row gap-2 items-center">
      <span className="font-bold uppercase text-blue-600">{travel?.name || 'N/A'}</span>
      <CellInfoPopover info={
        <div className="flex items-center gap-2">
        <span className="font-bold text-gray-400">Status:</span>
        <span
          className={`text-xs text-green-500`}
        >
          {travel?.status || 'N/A'}
        </span>
      </div>
      }/>
    </div>
  );
});

