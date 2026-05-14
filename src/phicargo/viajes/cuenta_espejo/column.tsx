import { Button } from "@heroui/react";
import { MRT_ColumnDef } from "material-react-table";

type WithIdViaje = {
  id_viaje: number;
};

export const createActionColumn = <T extends WithIdViaje>(
  onClick: (id: number) => void
): MRT_ColumnDef<T> => ({
  id: 'acciones',
  header: 'Cuenta espejo',

  Cell: ({ row }) => (
    <Button
      color="warning"
      className="text-white"
      size="sm"
      radius="full"
      onPress={() => onClick(row.original.id_viaje)}
    >
      <i className="bi bi-file-text"></i>
      Cuenta espejo
    </Button>
  ),
});