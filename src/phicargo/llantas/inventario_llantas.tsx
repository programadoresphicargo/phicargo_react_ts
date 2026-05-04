import {
  MRT_Cell,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { Button } from "@heroui/react"
import { Chip } from "@heroui/react";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { exportToCSV } from '../utils/export';
import odooApi from '@/api/odoo-api';

type ChipColor = "primary" | "success" | "warning" | "danger" | "secondary" | "default";

const InventarioLlantas = ({ }) => {

  const [dataSolicitudes, setDataSolicitudes] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/fleet_tires/');
      setDataSolicitudes(response.data);
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
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorKey: 'name',
        header: 'Llanta',
      },
      {
        accessorKey: 'marca',
        header: 'Marca',
      },
      {
        accessorKey: 'modelo',
        header: 'Modelo',
      },
      {
        accessorKey: 'x_estado_operativo',
        header: 'Estado',
        Cell: ({ cell }: { cell: MRT_Cell<any> }) => {
          const estatus = cell.getValue<string>();
          let badgeClass: ChipColor = "default";

          if (estatus === 'entregado') {
            badgeClass = 'primary';
          } else if (estatus === 'disponible') {
            badgeClass = 'success';
          } else if (estatus === 'borrador') {
            badgeClass = 'warning';
          } else if (estatus === 'devuelto') {
            badgeClass = 'success';
          } else if (estatus === 'cancelada') {
            badgeClass = 'danger';
          } else {
            badgeClass = 'secondary';
          }

          return (
            <Chip
              size="sm"
              color={badgeClass}
              className="text-white"
            >
              {estatus}
            </Chip>
          );
        },
      }
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: dataSolicitudes,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { showProgressBars: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    positionGlobalFilter: "right",
    localization: MRT_Localization_ES,
    muiSearchTextFieldProps: {
      placeholder: `Buscar en ${dataSolicitudes.length} llantas`,
      sx: { minWidth: '300px' },
      variant: 'outlined',
    },
    columnResizeMode: "onEnd",
    initialState: {
      showGlobalFilter: true,
      density: 'compact',
      expanded: true,
      showColumnFilters: true,
      pagination: { pageIndex: 0, pageSize: 80 },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'Bold',
        fontSize: '14px',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 250px)',
      },
    },
    muiTableBodyCellProps: () => ({
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '12px',
      },
    }),
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <h2
          className="tracking-tight font-semibold lg:text-2xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Inventario llantas
        </h2>

        <Button
          radius="full"
          className='text-white'
          startContent={<i className="bi bi-arrow-clockwise"></i>}
          color='secondary'
          onPress={() => fetchData()}
        >Actualizar
        </Button>

        <Button
          radius="full"
          color='success'
          className='text-white'
          startContent={<i className="bi bi-file-earmark-excel"></i>}
          onPress={() => exportToCSV(dataSolicitudes, columns, "solicitudes.csv")}>
          Exportar
        </Button>

      </Box >
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

export default InventarioLlantas;
