import { Button } from "@heroui/react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import FormularioCostoExtra from '@/phicargo/costos/maniobras/form_costos_extras';
import { ViajeContext } from '../context/viajeContext';
import odooApi from '@/api/odoo-api';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { FolioCostoExtra } from "@/phicargo/costos/folios/tabla";

const FoliosCostosExtrasViaje = () => {

  const { id_viaje } = useContext(ViajeContext);
  const [data, setData] = useState<FolioCostoExtra[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [id_folio, setFolio] = useState<number | null>(null);

  const handleShow = () => {
    setModalShow(true);
  };

  const handleClose = () => {
    setModalShow(false);
    fetchData();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/folios_costos_extras/by_travel_id/' + id_viaje);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id_viaje]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id_folio',
        header: 'Folio',
      },
      {
        accessorKey: 'empresa',
        header: 'Empresa',
      },
      {
        accessorKey: 'sucursal',
        header: 'Sucursal',
      },
      {
        accessorKey: 'fecha_creacion',
        header: 'Fecha creación',
      },
      {
        accessorKey: 'nombre',
        header: 'Creado por',
      },
      {
        accessorKey: 'cliente',
        header: 'Cliente',
      },
      {
        accessorKey: 'cartas_porte',
        header: 'Cartas porte',
      },
      {
        accessorKey: 'x_referencias',
        header: 'Contenedores',
      },
      {
        accessorKey: 'status',
        header: 'Estatus',
      },
      {
        accessorKey: 'ref_factura',
        header: 'Referencia factura',
      },
      {
        accessorKey: 'total',
        header: 'Total',
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
    localization: MRT_Localization_ES,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      showColumnFilters: true,
      pagination: { pageIndex: 0, pageSize: 80 },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 220px)',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        if (row.subRows?.length) {
        } else {
          setFolio(row.original.id_folio);
          handleShow();
        }
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

    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          alignItems: 'center',
        }}
      >
        <Box sx={{ width: '200px' }}>
          <Button
            radius="full"
            color="primary"
            fullWidth
            onPress={() => {
              handleShow();
            }}
          >
            Nuevo folio
          </Button>
        </Box>
      </Box>

    ),
  });

  return (
    <div>
      <FormularioCostoExtra
        show={modalShow}
        handleClose={handleClose}
        id_folio={id_folio}
      />
      <MaterialReactTable table={table} />
    </div >
  );

};

export default FoliosCostosExtrasViaje;
