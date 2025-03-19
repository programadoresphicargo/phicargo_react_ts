import type {
  MRT_ColumnFiltersState,
  MRT_ColumnOrderState,
  MRT_ColumnPinningState,
  MRT_GroupingState,
  MRT_SortingState,
} from 'material-react-table';
import { useEffect, useRef, useState } from 'react';

import { TableState } from '@/types';

const loadFromSessionStorage = (key: string) => {
  const storedValue = sessionStorage.getItem(key);
  try {
    return storedValue ? JSON.parse(storedValue) : undefined;
  } catch (error) {
    console.error(`Error parsing ${key} from sessionStorage`, error);
    return undefined;
  }
};

interface UseTableOptions {
  tableId: string;
  initialColumnFilters?: MRT_ColumnFiltersState;
}

export const useTableState = (options: UseTableOptions): TableState => {
  const { tableId, initialColumnFilters } = options;

  const isFirstRender = useRef(true);

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    () =>
      loadFromSessionStorage(`mrt_columnFilters_${tableId}`) ||
      initialColumnFilters ||
      [],
  );
  const [globalFilter, setGlobalFilter] = useState<string>(
    () => loadFromSessionStorage(`mrt_globalFilter_${tableId}`) || '',
  );
  const [sorting, setSorting] = useState<MRT_SortingState>(
    () => loadFromSessionStorage(`mrt_sorting_${tableId}`) || [],
  );
  const [grouping, setGrouping] = useState<MRT_GroupingState>(
    () => loadFromSessionStorage(`mrt_grouping_${tableId}`) || [],
  );
  const [columnPinning, setColumnPinning] = useState<MRT_ColumnPinningState>(
    () => loadFromSessionStorage(`mrt_collumn_pinning_${tableId}`) || [],
  );
  const [columnOrdering, setColumnOrdering] = useState<MRT_ColumnOrderState>(
    () => loadFromSessionStorage(`mrt_columnOrdering_${tableId}`) || [],
  );

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  // Guardar los estados en sessionStorage cuando cambien
  useEffect(() => {
    if (isFirstRender.current) return;
    sessionStorage.setItem(
      `mrt_columnFilters_${tableId}`,
      JSON.stringify(columnFilters),
    );
  }, [columnFilters, tableId]);

  useEffect(() => {
    if (isFirstRender.current) return;
    sessionStorage.setItem(
      `mrt_globalFilter_${tableId}`,
      JSON.stringify(globalFilter ?? ''),
    );
  }, [globalFilter, tableId]);

  useEffect(() => {
    if (isFirstRender.current) return;
    sessionStorage.setItem(`mrt_sorting_${tableId}`, JSON.stringify(sorting));
  }, [sorting, tableId]);

  useEffect(() => {
    if (isFirstRender.current) return;
    sessionStorage.setItem(`mrt_grouping_${tableId}`, JSON.stringify(grouping));
  }, [grouping, tableId]);

  useEffect(() => {
    if (isFirstRender.current) return;
    sessionStorage.setItem(
      `mrt_collumn_pinning_${tableId}`,
      JSON.stringify(columnPinning),
    );
  }, [columnPinning, tableId]);

  useEffect(() => {
    if (isFirstRender.current) return;
    sessionStorage.setItem(
      `mrt_columnOrdering_${tableId}`,
      JSON.stringify(columnOrdering),
    );
  }, [columnOrdering, tableId]);

  const resetState = () => {
    sessionStorage.removeItem(`mrt_columnFilters_${tableId}`);
    sessionStorage.removeItem(`mrt_globalFilter_${tableId}`);
    sessionStorage.removeItem(`mrt_sorting_${tableId}`);
    sessionStorage.removeItem(`mrt_grouping_${tableId}`);
    sessionStorage.removeItem(`mrt_collumn_pinning_${tableId}`);
    sessionStorage.removeItem(`mrt_columnOrdering_${tableId}`);

    setColumnFilters([]);
    setGlobalFilter('');
    setSorting([]);
    setGrouping([]);
    setColumnPinning({} as MRT_ColumnPinningState);
    setColumnOrdering({} as MRT_ColumnOrderState);
  };

  return {
    resetState,
    columnFilters,
    globalFilter,
    sorting,
    grouping,
    columnPinning,
    columnOrdering,
    setColumnFilters,
    setGlobalFilter,
    setSorting,
    setGrouping,
    setColumnPinning,
    setColumnOrdering,
  };
};

