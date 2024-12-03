import { MRT_ColumnDef } from "material-react-table";
import { User } from "../../auth/models";
import { useMemo } from "react";

export const useUsersColums = () => {

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID Usuario',
      },
      {
        accessorKey: 'name',
        header: 'Nombre del usuario',
      },
      {
        accessorKey: 'username',
        header: 'Usuario',
      },
      {
        accessorKey: 'role',
        header: 'Rol',
      },
    ],
    [],
  );


  return {
    columns
  }
}
