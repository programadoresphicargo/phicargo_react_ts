import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';

import { IoMdInformationCircle } from 'react-icons/io';
import { ReactNode } from 'react';

interface Props {
  info: ReactNode;
}

export const CellInfoPopover = ({ info }: Props) => {
  return (
    <Popover placement="top" showArrow color="foreground">
      <PopoverTrigger>
        <button className="text-gray-500 hover:text-gray-700">
          <IoMdInformationCircle className="w-5 h-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2 text-small font-bold uppercase">{info}</div>
      </PopoverContent>
    </Popover>
  );
};

