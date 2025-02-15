import 'rsuite/dist/rsuite-no-reset.min.css';

import { ChangeEvent, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import {
  Select,
  SelectItem,
  SharedSelection,
} from '@nextui-org/react';

import { BiBuildings } from 'react-icons/bi';
import { DateRangePicker } from 'rsuite';
import { IoMapOutline } from 'react-icons/io5';
import RefreshIcon from '@mui/icons-material/Refresh';
import dayjs from 'dayjs';
import { useDateRangeContext } from '../hooks/useDateRangeContext';
import { useRefetchFn } from '../hooks/useRefetchFn';

const { after } = DateRangePicker;

export const Header = () => {
  const { month, setMonth, setBranchId, setCompanyId, branchId, companyId } =
    useDateRangeContext();
  const [companyValue, setCompanyValue] = useState<SharedSelection>(
    new Set([]),
  );
  const [branchValue, setBranchValue] = useState<SharedSelection>(new Set([]));

  const refetchFn = useRefetchFn();

  const handleCompanySelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (!value) {
      setCompanyValue(new Set([]));
      setCompanyId(null);
    } else {
      setCompanyValue(new Set([value]));
      setCompanyId(Number(value));
    }
  };

  const handleBranchSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (!value) {
      setBranchValue(new Set([]));
      setBranchId(null);
    } else {
      setBranchValue(new Set([value]));
      setBranchId(Number(value));
    }
  };

  return (
    <div className="flex justify-between items-center px-4 mt-2">
      <div className="flex flex-row gap-6 items-center">
        <Select
          aria-label="company"
          placeholder="Empresa"
          variant="bordered"
          className="min-w-40"
          color={companyId ? 'primary' : 'default'}
          selectedKeys={companyValue}
          onChange={handleCompanySelect}
          startContent={<BiBuildings />}
        >
          <SelectItem key={1}>{'BELCHEZ'}</SelectItem>
          <SelectItem key={2}>{'PHICARGO'}</SelectItem>
        </Select>
        <Select
          aria-label="branch"
          placeholder="Sucursal"
          variant="bordered"
          className="min-w-40"
          color={branchId ? 'primary' : 'default'}
          selectedKeys={branchValue}
          onChange={handleBranchSelect}
          startContent={<IoMapOutline />}
        >
          <SelectItem key={1}>{'VERACRUZ'}</SelectItem>
          <SelectItem key={9}>{'MANZANILLO'}</SelectItem>
          <SelectItem key={2}>{'MÉXICO'}</SelectItem>
        </Select>
      </div>
      <div className="flex flex-row gap-2 border-2 items-center border-slate-300 rounded-xl p-1 shadow-md">
        <div className="flex flex-row items-center rounded-xl">
          <Tooltip arrow title="Refrescar">
            <IconButton size="small" onClick={() => refetchFn()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </div>
        <DateRangePicker
          hoverRange="month"
          oneTap
          showOneCalendar
          placeholder="Selecciona Un Mes"
          size="sm"
          format="dd/MM/yyyy"
          character=" - "
          showWeekNumbers
          value={month}
          onChange={setMonth}
          shouldDisableDate={after(dayjs().endOf('month').toDate())}
        />
      </div>
    </div>
  );
};

