import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Box } from '@mui/material';
import { CostosExtrasContext } from '../context/estadiasContext';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

const CostosExtras = ({ onClose }) => {

  const { costosExtras, actualizarCE } = useContext(CostosExtrasContext);

  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState();

  const fetchData = async () => {

    try {
      setLoading(true);
      const response = await fetch('/phicargo/viajes/estadias/getCostosExtras.php', {
        method: 'POST',
        body: new URLSearchParams({
        }),
      });

      const jsonData = await response.json();
      setData(jsonData);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id_costo',
        header: 'ID Costo',
      },
      {
        accessorKey: 'descripcion',
        header: 'Descripción',
      },
      {
        accessorKey: 'costo',
        header: 'Costo',
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { isLoading: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      showColumnFilters: true,
      pagination: { pageSize: 80 },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        actualizarCE((prevCostosExtras) => [...prevCostosExtras, row.original]);
        onClose();
      },
      style: {
        cursor: 'pointer',
      },
    }),
    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '14px',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
      },
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          alignItems: 'center',
        }}
      >
        <h1 className='text-primary'>Costos extras</h1>
      </Box>
    ),
  });

  return (
    <>
      <MaterialReactTable
        table={table}
      />
    </>
  );
};

export default CostosExtras;
