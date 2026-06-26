import { Button, Chip } from "@heroui/react";
import {
  MRT_Cell,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { Select, SelectItem } from "@heroui/react";
import { Box } from '@mui/material';
import { useCostosExtras } from '../context/context';
import FormularioCostoExtra from '../maniobras/form_costos_extras';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { exportToCSV } from '../../utils/export';
import { getEstadoChip } from '../utils';
import odooApi from '@/api/odoo-api';

export type CostoExtraAplicado = {
  id_tipo_costo: number | null;
  descripcion: string;
  costo: number;
  unidad_medida: string;
  observaciones: string;
  cantidad: number;
  iva: number;
  retencion: number;
  subtotal: number;
  total: number;
  ajuste_cobro: number;
}

export type FolioCostoExtra = {
  id_folio: number | null;
  id_factura: number | null;
  referencia_factura: string | null;
  estado_factura: string;
  fecha_factura: string | null;
  status: string;

  fecha_creacion?: string | null;
  usuario_creacion?: string | null;

  usuario_confirmacion?: string | null;
  fecha_confirmacion?: string | null;

  fecha_facturacion?: string | null;
  usuario_facturo?: string | null;

  usuario_cancelacion?: string | null;
  motivo_cancelacion?: string | null;
  comentarios_cancelacion?: string | null;
  fecha_cancelacion?: string | null;

  costos_extras: CostoExtraAplicado[];
};

const FoliosCostosExtras = () => {

  const { setCPS, setCPSEliminadas } = useCostosExtras();

  const [id_folio, setFolio] = useState<number | null>(null);
  const [data, setData] = useState<FolioCostoExtra[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [store, setStore] = React.useState<string>("1");

  const changeStore = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStore(e.target.value);
  };

  const limpiarForm = () => {
    setCPS([]);
    setCPSEliminadas([]);
  };

  const handleShow = () => {
    setModalShow(true);
  };

  const handleCloseModal = () => {
    setModalShow(false);
    fetchData();
    limpiarForm();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/folios_costos_extras/by_store_id/' + store);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [store]);

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
        accessorKey: 'referencia_viaje',
        header: 'Viaje',
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
        Cell: ({ cell }: { cell: MRT_Cell<FolioCostoExtra> }) => {
          const status = cell.getValue<string>() || '';

          return (
            <Chip color={status === "cancelado" ? "danger" : status === "facturado" ? "success" : status === "borrador" ? "warning" : "default"} size='sm' className="text-white">
              {status}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'referencia_factura',
        header: 'Referencia factura',
      },
      {
        accessorKey: 'fecha_factura',
        header: 'Fecha factura',
      },
      {
        accessorKey: 'estado_factura',
        header: 'Estado',
        Cell: ({ cell }: { cell: MRT_Cell<FolioCostoExtra> }) => {
          const estado = cell.getValue<string>();
          const { color, text } = getEstadoChip(estado);

          return (
            <Chip color={color} size='sm' className="text-white">
              {text}
            </Chip>
          );
        },
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
    localization: MRT_Localization_ES,
    state: { showProgressBars: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
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
          handleShow();
          setFolio(row.original.id_folio);
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
        fontSize: '12px',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '12px',
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
        <h1
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Costos extras
        </h1>
        <Box sx={{ width: '160px' }}>
          <Button
            radius="full"
            startContent={<i className="bi bi-plus-lg"></i>}
            color="primary"
            fullWidth
            onPress={() => {
              limpiarForm();
              handleShow();
              setFolio(null);
            }}
          >
            Nuevo folio
          </Button>
        </Box>

        <Box sx={{ width: '160px' }}>
          <Button
            radius="full"
            startContent={<i className="bi bi-arrow-clockwise"></i>}
            color="success"
            className='text-white'
            fullWidth
            onPress={() => {
              fetchData();
            }}
          >
            Actualizar
          </Button>
        </Box>

        <Box sx={{ width: '160px' }}>
          <Button
            radius="full"
            color='success'
            fullWidth
            className='text-white'
            startContent={<i className="bi bi-file-earmark-excel"></i>}
            onPress={() => exportToCSV(data, columns, "costos_extras.csv")}>Exportar</Button>
        </Box>

        <Box sx={{ width: '250px' }}>
          <Select
            label="Sucursal"
            placeholder="Selecciona una sucursal"
            selectedKeys={[store]}
            onChange={changeStore}
            fullWidth
          >
            <SelectItem key={'1'}>Veracruz</SelectItem>
            <SelectItem key={'2'}>México</SelectItem>
            <SelectItem key={'9'}>Manzanillo</SelectItem>
          </Select>
        </Box>
      </Box>
    ),
  });

  return (
    <>
      <FormularioCostoExtra
        show={modalShow}
        handleClose={handleCloseModal}
        id_folio={id_folio}
      />
      <MaterialReactTable table={table} />
    </>
  );

};

export default FoliosCostosExtras;
