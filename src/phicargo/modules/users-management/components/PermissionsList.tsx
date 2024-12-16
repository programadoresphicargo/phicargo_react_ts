import type { Permission } from '../models';

interface Props {
  permissionsList: Permission[];
  selectedPermissions: number[];
  togglePermission: (id: number) => void;
}

export const PermissionsList = (props: Props) => {
  const { permissionsList, selectedPermissions, togglePermission } = props;

  return (
    <ul className="space-y-2 max-h-96 min-h-96 overflow-y-auto">
      {permissionsList?.map((perm) => (
        <li
          key={perm.id}
          className="flex items-center space-x-2 py-1 px-2 border-2 border-gray-300 rounded-lg"
        >
          <input
            type="checkbox"
            id={`perm-${perm.id}`}
            checked={selectedPermissions.includes(perm.id)}
            onChange={() => togglePermission(perm.id)}
            className="h-4 w-4"
          />
          <label htmlFor={`perm-${perm.id}`} className="text-sm">
            <span className="text-medium uppercase text-gray-800">
              {perm.name}
            </span>
            {perm.description && (
              <span className="text-gray-700 text-medium">
                {' '}
                - {perm.description}
              </span>
            )}
          </label>
        </li>
      ))}
    </ul>
  );
};

