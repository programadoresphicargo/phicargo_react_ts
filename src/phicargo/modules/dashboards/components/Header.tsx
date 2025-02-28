import { ChangeEvent, useState } from 'react';
import { Select, SelectItem, SharedSelection } from '@heroui/react';

import { BiBuildings } from 'react-icons/bi';
import { DatePicker } from './DatePicker';
import { IoMapOutline } from 'react-icons/io5';
import { useDateRangeContext } from '../hooks/useDateRangeContext';

export const Header = () => {
  const { setBranchId, setCompanyId, branchId, companyId } =
    useDateRangeContext();
  const [companyValue, setCompanyValue] = useState<SharedSelection>(
    new Set([]),
  );
  const [branchValue, setBranchValue] = useState<SharedSelection>(new Set([]));

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
      <DatePicker />
    </div>
  );
};

