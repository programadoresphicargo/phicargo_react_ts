import type { DriverBonus } from '../models';
import { MRT_ColumnDef } from 'material-react-table';
import { TextField } from '@mui/material';
import { formatCurrency } from '@/utilities';
import { useMemo } from 'react';

export const useDriverBonusColumns = (
  userPermissions: number[],
  isEditing: boolean,
  editedRecords: DriverBonus[],
  setEditedRecords: (data: DriverBonus[]) => void,
) => {
  const handleEditChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    rowIndex: number,
    columnId: keyof DriverBonus,
  ) => {
    const newData = [...editedRecords];
    // @ts-expect-error no se puede inferir el tipo
    newData[rowIndex][columnId] = event.target.value;
    setEditedRecords(newData);
  };

  const columns = useMemo<MRT_ColumnDef<DriverBonus>[]>(
    () => [
      {
        accessorKey: 'driver',
        header: 'Operador',
      },
      {
        accessorKey: 'distance',
        header: 'Km recorridos',
      },
      {
        accessorKey: 'excellence',
        header: 'Excelencia',
        Cell: ({ row, cell }) =>
          isEditing && userPermissions.includes(12) ? (
            <TextField
              variant="standard"
              value={editedRecords[row.index].excellence}
              onChange={(e) => handleEditChange(e, row.index, 'excellence')}
              size="small"
              type="number"
            />
          ) : (
            formatCurrency(cell.getValue<number>())
          ),
      },
      {
        accessorKey: 'productivity',
        header: 'Productividad',
        Cell: ({ row, cell }) =>
          isEditing && userPermissions.includes(12) ? (
            <TextField
              variant="standard"
              value={editedRecords[row.index].productivity}
              onChange={(e) => handleEditChange(e, row.index, 'productivity')}
              size="small"
              type="number"
            />
          ) : (
            formatCurrency(cell.getValue<number>())
          ),
      },
      {
        accessorKey: 'operation',
        header: 'Operacion',
        Cell: ({ row, cell }) =>
          isEditing && userPermissions.includes(12) ? (
            <TextField
              variant="standard"
              value={editedRecords[row.index].operation}
              onChange={(e) => handleEditChange(e, row.index, 'operation')}
              size="small"
              type="number"
            />
          ) : (
            formatCurrency(cell.getValue<number>())
          ),
      },
      {
        accessorKey: 'roadSafety',
        header: 'Seguridad vial',
        Cell: ({ row, cell }) =>
          isEditing && userPermissions.includes(9) ? (
            <TextField
              variant="standard"
              value={editedRecords[row.index].roadSafety}
              onChange={(e) => handleEditChange(e, row.index, 'roadSafety')}
              size="small"
              type="number"
            />
          ) : (
            formatCurrency(cell.getValue<number>())
          ),
      },
      {
        accessorKey: 'vehicleCare',
        header: 'Cuidado unidad',
        Cell: ({ row, cell }) =>
          isEditing && userPermissions.includes(10) ? (
            <TextField
              variant="standard"
              value={editedRecords[row.index].vehicleCare}
              onChange={(e) => handleEditChange(e, row.index, 'vehicleCare')}
              size="small"
              type="number"
            />
          ) : (
            formatCurrency(cell.getValue<number>())
          ),
      },
      {
        accessorKey: 'performance',
        header: 'Rendimiento',
        Cell: ({ row, cell }) =>
          isEditing && userPermissions.includes(10) ? (
            <TextField
              variant="standard"
              value={editedRecords[row.index].performance}
              onChange={(e) => handleEditChange(e, row.index, 'performance')}
              size="small"
              type="number"
            />
          ) : (
            formatCurrency(cell.getValue<number>())
          ),
      },
      {
        accessorKey: 'score',
        header: 'Calificación',
        Cell: ({ row, cell }) =>
          isEditing && userPermissions.includes(10) ? (
            <TextField
              variant="standard"
              value={editedRecords[row.index].score}
              onChange={(e) => handleEditChange(e, row.index, 'score')}
              size="small"
              type="number"
            />
          ) : (
            cell.getValue<number>()
          ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editedRecords, isEditing, userPermissions],
  );

  return columns;
};

