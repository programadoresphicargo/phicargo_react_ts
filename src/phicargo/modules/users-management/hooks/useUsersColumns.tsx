import { Chip } from "@nextui-org/react";
import { MRT_ColumnDef } from "material-react-table";
import { User } from "../../auth/models";
import { useMemo } from "react";

export const useUsersColums = () => {

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID Usuario',
        Cell: ({ cell }) => <span className='text-gray-400 text-sm'>{cell.getValue<string>()}</span>
      },
      {
        accessorKey: 'username',
        header: 'Usuario',
        Cell: ({ cell }) => 
          <Chip color="primary" size="sm">{cell.getValue<string>()}</Chip>
      },
      {
        accessorKey: 'name',
        header: 'Nombre del usuario',
        Cell: ({ cell }) => <span className='font-bold uppercase'>{cell.getValue<string>()}</span>
      },
      {
        accessorKey: 'email',
        header: 'Correo',
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return !value 
            ? <span className='text-gray-400 text-sm'>{'SIN ASIGNAR'}</span>
            : <span className='font-bold'>{cell.getValue<string>()}</span>
        } 
      },
      {
        accessorKey: 'role',
        header: 'Rol',
        Cell: ({ cell }) => <Chip color='primary' size="sm">{cell.getValue<string>()}</Chip>
      },
    ],
    [],
  );


  return {
    columns
  }
}
