import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import customFontTheme from '../../../theme';

import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import ManiobrasNavBar from '../Navbar';

const Precios_maniobras = () => {

  const storeArray = ['store_id'];
  const ejecutivoArray = ['store_id'];

  // Estado para el array seleccionado y agrupación
  const [selectedKeys, setSelectedKeys] = useState(null);
  const [selectedValue, setSelectedValue] = useState('Select Option');
  const [groupByFields, setGroupByFields] = useState([]);

  // Maneja la selección del dropdown y actualiza las columnas para agrupar
  const handleSelectionChange = (keys) => {
    setSelectedKeys(keys);
    if (keys.anchorKey === 'store') {
      setSelectedValue('Store ID');
      setGroupByFields(storeArray); // Agrupa por 'store_id'
    } else if (keys.anchorKey === 'ejecutivo') {
      setSelectedValue('Ejecutivo');
      setGroupByFields(ejecutivoArray); // Agrupa por 'x_ejecutivo_bel'
    }
  };

  const [isLoading2, setLoading] = useState();
  const [data, setData] = useState([]); // Estado para almacenar los datos

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/phicargo/modulo_maniobras/nominas/precios/get_precios.php');

        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'numero_contenedores',
        header: 'Número de contenedores',
      },
      {
        accessorKey: 'peligroso',
        header: 'Peligroso',
        size: 150,
        Cell: ({ cell }) => {
          const value = cell.getValue();
          var respuesta = '';
          if (value == true) {
            respuesta = 'SI';
          } else {
            respuesta = 'NO';

          }
          return respuesta;
        }
      },
      {
        accessorKey: 'precio',
        header: 'Precio',
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
    initialState: {
      density: 'compact',
      pagination: { pageSize: 80 },
    },
    state: { isLoading: isLoading2 },
    muiCircularProgressProps: {
      color: 'primary',
      thickness: 5,
      size: 45,
    },
    muiSkeletonProps: {
      animation: 'pulse',
      height: 28,
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: ({ event }) => {
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
  });

  return (
    <div>
      <ManiobrasNavBar />
      <ThemeProvider theme={customFontTheme}>
        <MaterialReactTable table={table} />
      </ThemeProvider>
    </div >
  );

};

export default Precios_maniobras;
