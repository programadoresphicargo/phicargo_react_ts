import { useEffect, useState } from 'react';

import { FaSearch } from 'react-icons/fa';
import { Input } from "@heroui/react";
import { Permission } from '../models';
import { useDebounce } from '../../core/hooks';

const searchPermissions = (permissions: Permission[], searchTerm: string) => {
  return permissions.filter((perm) =>
    perm.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
};

interface Props {
  permissions: Permission[];
  setAllPermissions: (permissions: Permission[]) => void;
}

export const PermissionsSearchBar = ({
  permissions,
  setAllPermissions,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (!debouncedSearchTerm) {
      setAllPermissions(permissions);
    } else {
      const filteredPermissions = searchPermissions(
        permissions,
        debouncedSearchTerm,
      );
      setAllPermissions(filteredPermissions);
    }
  }, [debouncedSearchTerm, permissions, setAllPermissions]);

  return (
    <Input
      placeholder="Buscar permisos..."
      className="mx-4"
      variant="bordered"
      isClearable
      onClear={() => setSearchTerm('')}
      onChange={handleSearch}
      startContent={
        <FaSearch className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="text"
    />
  );
};

