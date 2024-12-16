import type {
  MRT_ColumnFiltersState,
  MRT_GroupingState,
  MRT_SortingState,
} from 'material-react-table';
import { useEffect, useRef, useState } from 'react';

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

export const useTableState = (options: UseTableOptions) => {
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

  const resetState = () => {
    sessionStorage.removeItem(`mrt_columnFilters_${tableId}`);
    sessionStorage.removeItem(`mrt_globalFilter_${tableId}`);
    sessionStorage.removeItem(`mrt_sorting_${tableId}`);
    sessionStorage.removeItem(`mrt_grouping_${tableId}`);

    setColumnFilters([]);
    setGlobalFilter('');
    setSorting([]);
    setGrouping([]);
  };

  return {
    resetState,
    columnFilters,
    globalFilter,
    sorting,
    grouping,
    setColumnFilters,
    setGlobalFilter,
    setSorting,
    setGrouping,
  };
};

