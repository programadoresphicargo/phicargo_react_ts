import { Dispatch, SetStateAction } from 'react';
import type {
  MRT_ColumnFiltersState,
  MRT_ColumnOrderState,
  MRT_ColumnPinningState,
  MRT_GroupingState,
  MRT_SortingState,
} from 'material-react-table';

export interface TableState {
  resetState: () => void;
  columnFilters: MRT_ColumnFiltersState;
  globalFilter: string;
  sorting: MRT_SortingState;
  grouping: MRT_GroupingState;
  columnPinning: MRT_ColumnPinningState;
  columnOrdering: MRT_ColumnOrderState;
  setColumnFilters: Dispatch<SetStateAction<MRT_ColumnFiltersState>>;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  setSorting: Dispatch<SetStateAction<MRT_SortingState>>;
  setGrouping: Dispatch<SetStateAction<MRT_GroupingState>>;
  setColumnPinning: Dispatch<SetStateAction<MRT_ColumnPinningState>>;
  setColumnOrdering: Dispatch<SetStateAction<MRT_ColumnOrderState>>;
}
