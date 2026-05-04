import {
  MRT_RowSelectionState,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { Button } from "@heroui/react"
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import odooApi from '@/api/odoo-api';
import toast from 'react-hot-toast';

type Llanta = {
  id: number;
  name: string;
  marca: string;
  modelo: string;
};

type Linea = {
  id: number;
  x_tire_id: number;
  name?: string;
  marca?: string;
  modelo?: string;
  descuento?: number | null;
  condicion?: string;
  observaciones?: string;
  fecha_devolucion?: string;
};

type LlantasDisponiblesProps = {
  onClose: () => void;
  lineas: Linea[];
  setLineas: (lineas: Linea[]) => void;
};

const LlantasDisponibles: React.FC<LlantasDisponiblesProps> = ({
  onClose,
  lineas,
  setLineas
}) => {

  const [dataEquipos, setDataEquipo] = useState<Llanta[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/fleet_tires/');
      setDataEquipo(response.data);
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
      { accessorKey: 'name', header: 'Llantas' },
      { accessorKey: 'marca', header: 'Marca' },
      { accessorKey: 'modelo', header: 'Modelo' },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: dataEquipos,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: { showProgressBars: isLoading, rowSelection },
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    enableColumnPinning: true,
    enableStickyHeader: true,
    positionGlobalFilter: "right",
    localization: MRT_Localization_ES,
    columnResizeMode: "onEnd",
    initialState: {
      showGlobalFilter: true,
      density: 'compact',
      expanded: true,
      showColumnFilters: true,
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: { borderRadius: '0' },
    },
    muiTableHeadCellProps: {
      sx: { fontFamily: 'Inter', fontWeight: 'Bold', fontSize: '14px' },
    },
    muiTableContainerProps: {
      sx: { maxHeight: 'calc(100vh - 300px)' },
    },
    muiTableBodyCellProps: () => ({
      sx: { fontFamily: 'Inter', fontWeight: 'normal', fontSize: '12px' },
    }),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{ display: 'flex', gap: '16px', padding: '8px', flexWrap: 'wrap' }}
      >
        <h1
          className="tracking-tight font-semibold lg:text-2xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Llantas disponibles
        </h1>

        <Button
          radius='full'
          className="text-white"
          startContent={<i className="bi bi-arrow-clockwise"></i>}
          color="primary"
          onPress={() => fetchData()}
        >
          Actualizar
        </Button>

        <Button
          radius='full'
          className="text-white"
          color="secondary"
          isDisabled={Object.keys(rowSelection).length === 0} // deshabilitado si no hay selección
          onPress={() => {

            const selectedRows = table.getSelectedRowModel().rows;

            const nuevas: Linea[] = [];
            const repetidas: string[] = [];

            selectedRows.forEach((row) => {

              const existe = lineas.some(
                (l) => l.x_tire_id === row.original.id
              );

              if (existe) {
                repetidas.push(row.original.name);
              } else {
                nuevas.push({
                  id: -(Date.now() + Math.floor(Math.random() * 1000)),
                  x_tire_id: row.original.id,
                  name: row.original.name,
                  marca: row.original.marca,
                  modelo: row.original.modelo,
                });
              }

            });

            if (repetidas.length > 0) {
              toast.error(`Las siguientes llantas ya están agregadas: ${repetidas.join(', ')}`);
            }

            if (nuevas.length > 0) {
              setLineas([...lineas, ...nuevas]);
            }

            setRowSelection({});
            onClose();
          }}
        >
          Agregar a solicitud
        </Button>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default LlantasDisponibles;
