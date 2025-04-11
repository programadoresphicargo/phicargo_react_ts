import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  SharedSelection,
} from '@heroui/react';
import { useEffect, useMemo, useState } from 'react';

import type { Option } from '@/types';

interface Props<T> {
  options: Option<T>[];
  defaultSelectedKey?: string;
  onOptionChange?: (option: Option<T>) => void;
}

export const FiltersMenu = <T,>(props: Props<T>) => {
  const [selectedKeys, setSelectedKeys] = useState<SharedSelection>(
    new Set([props.defaultSelectedKey ?? '']),
  );

  const selectedValue = useMemo(
    () => {
      const key = Array.from(selectedKeys).join(', ').replace(/_/g, '')
      const selectedOption = props.options.find(
        (option) => option.key === key,
      );
      return selectedOption?.label ?? '';
    },
    [props.options, selectedKeys],
  );

  useEffect(() => {
    const selectedOption = props.options.find(
      (option) => option.key === Array.from(selectedKeys)[0],
    );
    if (selectedOption && props.onOptionChange) {
      props.onOptionChange(selectedOption);
    }
  }, [props, selectedKeys]);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          className="capitalize"
          variant="bordered"
          size="sm"
        >
          {selectedValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="predefined-filters"
        selectedKeys={selectedKeys}
        selectionMode="single"
        variant="flat"
        onSelectionChange={setSelectedKeys}
      >
        {props.options.map((option) => (
          <DropdownItem key={option.key}>{option.label}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

