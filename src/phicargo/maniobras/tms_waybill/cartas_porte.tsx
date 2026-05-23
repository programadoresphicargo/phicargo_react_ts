import { Button, Chip, Select, SelectItem } from "@heroui/react";
import {
  MRT_Cell,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { ManiobraProvider } from '../context/viajeContext';
import { exportToCSV } from '../../utils/export';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { DateRangePicker } from 'rsuite';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import CustomNavbar from "@/pages/CustomNavbar";
import { pages } from '../pages';
import RegistroManiobrasCP from "../maniobras/modal";

export type Contenedor = {
  id_cp: number;
  id_cliente: number;
  sucursal?: string;
  date_order?: string;
  carta_porte?: string;
  cliente?: string;
  x_reference?: string;
  x_status_bel?: string;
  estado_eir?: string;
  x_ejecutivo_viaje_bel?: string;
  state?: string;
  x_modo_bel?: string;
};

const CartasPorte = () => {

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [range, setRange] = useState<[Date, Date] | null>([firstDay, lastDay]);

  const [isLoading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = React.useState("carta");
  const [data, setData] = useState<Contenedor[]>([]);

  const [modalShow, setModalShow] = useState(false);
  const [dataCP, setDataCP] = useState<Contenedor | null>(null);

  const handleShowModal = (data: Contenedor) => {
    setModalShow(true);
    setDataCP(data);
  };

  const handleCloseModal = () => setModalShow(false);

  const fetchData = async () => {
    if (!range) return;
    setLoading(true);
    try {
      const response = await odooApi.get('/tms_waybill/get_contenedores/',
        {
          params: {
            date_start: range[0].toISOString().slice(0, 10),
            date_end: range[1].toISOString().slice(0, 10),
            tab: selectedTab
          }
        });
      setData(response.data);
    } catch (error) {
      toast.error('Error al obtener los datos:' + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range, selectedTab]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'sucursal',
        header: 'Sucursal',
      },
      {
        accessorKey: 'date_order',
        header: 'Fecha',
      },
      {
        accessorKey: 'carta_porte',
        header: 'Carta porte',
      },
      {
        accessorKey: 'cliente',
        header: 'Cliente',
      },
      {
        accessorKey: 'x_reference',
        header: 'Contenedor',
        size: 150,
      },
      {
        accessorKey: 'x_status_bel',
        header: 'Estatus',
        size: 150,
        Cell: ({ cell }: { cell: MRT_Cell<Contenedor> }) => {

          const value = String(cell.getValue() ?? '');

          type ChipColor =
            | 'default'
            | 'primary'
            | 'secondary'
            | 'success'
            | 'warning'
            | 'danger';

          const mappings: Record<
            string,
            { variant: ChipColor; text: string }
          > = {
            sm: { variant: 'secondary', text: 'SIN MANIOBRA' },
            EI: { variant: 'warning', text: 'EN PROCESO DE INGRESO' },
            pm: { variant: 'primary', text: 'PATIO MÉXICO' },
            Ing: { variant: 'success', text: 'INGRESADO' },
            'No Ing': { variant: 'danger', text: 'NO INGRESADO' },
            ru: { variant: 'secondary', text: 'REUTILIZADO' },
            can: { variant: 'danger', text: 'CANCELADO' },
            P: { variant: 'primary', text: 'EN PATIO' },
            T: { variant: 'warning', text: 'EN TERRAPORTS' },
            V: { variant: 'success', text: 'EN VIAJE' },
            PR: { variant: 'success', text: 'PROGRAMADO PARA RETIRO' },
            PI: { variant: 'warning', text: 'PROGRAMADO PARA INGRESO' },
            ER: { variant: 'warning', text: 'EN PROCESO DE RETIRO' },
            EV: { variant: 'secondary', text: 'EN ESPERA DE VIAJE' },
          };

          const current = mappings[value];

          const variant: ChipColor =
            current?.variant ?? 'danger';

          const text =
            current?.text ?? value ?? 'DESCONOCIDO';

          return value ? (
            <Chip
              color={variant}
              size="sm"
              className="text-white"
            >
              {text}
            </Chip>
          ) : null;
        },
      },
      {
        accessorKey: 'estado_eir',
        header: 'EIR',
        size: 150,
      },
      {
        accessorKey: 'x_ejecutivo_viaje_bel',
        header: 'Ejecutivo',
        size: 150,
      },
      {
        accessorKey: 'state',
        header: 'Estado CP',
        size: 150,
      },
      {
        accessorKey: 'x_modo_bel',
        header: 'Modo',
        size: 150,
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableColumnPinning: true,
    enableStickyHeader: true,
    localization: MRT_Localization_ES,
    positionToolbarAlertBanner: 'none',
    positionGlobalFilter: "right",
    muiSearchTextFieldProps: {
      placeholder: `Buscador global`,
      sx: { minWidth: '300px' },
      variant: 'outlined',
    },
    initialState: {
      showColumnFilters: true,
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 80 },
      showGlobalFilter: false,
    },
    state: { showProgressBars: isLoading },
    muiCircularProgressProps: {
      color: 'primary',
      thickness: 5,
      size: 45,
    },
    muiSkeletonProps: {
      animation: 'pulse',
      height: 28,
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        if (row.subRows?.length) {
        } else {
          handleShowModal(row.original);
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
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 210px)',
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row.subRows?.length ? '#1184e8' : '#FFFFFF',
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
        color: row.subRows?.length ? '#FFFFFF' : '#000000',
      },
    }),
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
          Contenedores
        </h1>
        <DateRangePicker
          style={{ minWidth: "250px" }}
          value={range}
          onChange={(value) => setRange(value)}
          placeholder="Selecciona un rango de fechas"
          format="yyyy-MM-dd"
        />
        <Select
          style={{ minWidth: "300px" }}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            setSelectedTab(value);
          }}
          label="Seleccionar una opción"
          size={'sm'}
          variant='bordered'
          selectedKeys={[selectedTab]}
          radius="full"
          fullWidth={true}>
          <SelectItem key={'carta'}>Cartas porte</SelectItem>
          <SelectItem key={'solicitud'}>Solicitudes de transporte</SelectItem>
        </Select>
        <Button
          color='success'
          fullWidth
          className='text-white'
          startContent={<i className="bi bi-file-earmark-excel"></i>}
          onPress={() => exportToCSV(data, columns, "contenedores.csv")}
          radius="full"
        >Exportar
        </Button>
        <Button
          color='danger'
          fullWidth
          className='text-white'
          startContent={<i className="bi bi-arrow-clockwise"></i>}
          onPress={() => fetchData()}
          radius="full"
        >Recargar
        </Button>
      </Box>
    ),
  });

  return (
    <>
      <ManiobraProvider>
        <CustomNavbar pages={pages}></CustomNavbar>
        <MaterialReactTable table={table} />
        {dataCP && (
          <RegistroManiobrasCP
            show={modalShow}
            handleClose={handleCloseModal}
            data={dataCP} />
        )}
      </ManiobraProvider>
    </>
  );
};

export default CartasPorte;
