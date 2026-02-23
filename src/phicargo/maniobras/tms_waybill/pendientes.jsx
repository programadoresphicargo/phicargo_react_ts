import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Button, Chip, Link } from "@heroui/react";
import Box from "@mui/material/Box";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { toast } from "react-toastify";

import odooApi from "@/api/odoo-api";
import CustomNavbar from "@/pages/CustomNavbar";
import { pages } from "../pages";
import { ManiobraProvider } from "../context/viajeContext";
import ContenedorEdit from "./datos";
import CountContenedor from "./count_contenedor";
import { exportToCSV } from "../../utils/export";
import Travel from "@/phicargo/viajes/control/viaje";

const { VITE_ODOO_API_URL } = import.meta.env;

const ContenedoresPendientes = () => {

  /* =======================
     ESTADOS
  ======================= */
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dataCP, setDataCP] = useState({});
  const [openViaje, setOpenViaje] = useState(false);
  const [idViaje, setIDViaje] = React.useState(null);

  const handleClickOpen = (id) => {
    console.log(id);
    setIDViaje(id);
    setOpenViaje(true);
  };

  const handleClose = () => {
    setOpenViaje(false);
  };

  /* =======================
     FETCH
  ======================= */
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await odooApi.get("/tms_waybill/pendientes_ing/");
      setData(response.data);
    } catch (error) {
      toast.error("Error al obtener los datos");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* =======================
     FILTRO POR SUCURSAL
  ======================= */
  useEffect(() => {
    if (selectedBranches.length === 0) {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter(item =>
          selectedBranches.includes(item.store_id)
        )
      );
    }
  }, [data, selectedBranches]);

  /* =======================
     COLUMNAS
  ======================= */
  const columns = useMemo(() => [
    { accessorKey: "sucursal", header: "Sucursal" },
    { accessorKey: "date_order", header: "Fecha" },
    { accessorKey: "carta_porte", header: "Carta porte" },
    { accessorKey: "categoria", header: "Categoria" },
    { accessorKey: "cliente", header: "Cliente" },
    { accessorKey: "x_reference", header: "Contenedor" },
    { accessorKey: 'flr_formateada', header: 'Llegada de puerto a patio' },
    { accessorKey: 'dias_retiro', header: 'Días desde el retiro' },
    { accessorKey: 'fecha_inicio_formateada', header: 'Inicio de viaje' },
    { accessorKey: 'dias_viaje', header: 'Días en viaje' },
    { accessorKey: "flp_formateada", header: "Llegada a patio" },
    { accessorKey: "dias_en_patio", header: "Días en patio" },
    {
      accessorKey: "x_status_bel",
      header: "Estatus",
      Cell: ({ row, cell }) => {

        const value = cell.getValue();
        const map = {
          sm: { color: "secondary", text: "SIN MANIOBRA" },
          pm: { color: "primary", text: "PATIO MÉXICO" },
          P: { color: "primary", text: "EN PATIO" },
          V: { color: "success", text: "EN VIAJE" },
          PR: { color: "success", text: "PROGRAMADO PARA RETIRO" },
          ER: { color: "success", text: "EN PROCESO DE RETIRO" },
          PI: { color: "warning", text: "PROGRAMADO PARA INGRESO" },
          EI: { color: "warning", text: "EN PROCESO DE INGRESO" },
          T: { color: "danger", text: "EN TERRAPORTS" },
          ru: { color: "danger", text: "REUTILIZADO" },
        };

        const cfg = map[value] || { color: "danger", text: value || "N/A" };

        return (
          <Button color={cfg.color} size="sm" className="text-white" onPress={() => handleClickOpen(row.original.travel_id)} radius="full">
            {cfg.text}
          </Button>
        );
      },
    },
    { accessorKey: "total_dias", header: "Total dias" },
  ], []);

  /* =======================
     TABLA
  ======================= */
  const table = useMaterialReactTable({
    columns,
    data: filteredData,
    localization: MRT_Localization_ES,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Button
          size="sm"
          color="success"
          className="text-white"
          radius="full"
          onClick={(event) => {
            event.stopPropagation();
            setDataCP(row.original);
            setOpen(true);
          }}>
          Editar
        </Button>
      </Box >
    ),
    state: { showProgressBars: isLoading },
    initialState: {
      pagination: { pageSize: 80 },
      density: "compact",
      showColumnFilters: true,
      showGlobalFilter: true,
      grouping: ['x_status_bel']
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

      },
      sx: { cursor: "pointer" },
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
    muiTableBodyCellProps: ({ row }) => {
      const inicioProgramado = row.original.total_dias;

      let backgroundColor = '';
      let ColorText = '';

      if (inicioProgramado >= 4) {
        backgroundColor = '#f5a200';
        ColorText = '#FFFFFF';
      }

      return {
        sx: {
          backgroundColor: row.subRows?.length ? '#1184e8' : backgroundColor,
          color: ColorText,
          fontFamily: 'Inter',
          fontWeight: 'normal',
          fontSize: '12px',
        },
      }
    },
    muiTableBodyCellProps2: ({ row }) => ({
      sx: {
        backgroundColor: row.subRows?.length ? '#1184e8' : '#FFFFFF',
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
        color: row.subRows?.length ? '#FFFFFF' : '#000000',
      },
    }),
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          radius="full"
          showAnchorIcon
          as={Link}
          isExternal={true}
          color="primary"
          href={VITE_ODOO_API_URL + '/maniobras/reporte_email/'}
        >
          Enviar por correo
        </Button>
        <Button
          color="success"
          className="text-white"
          radius="full"
          onPress={() => exportToCSV(filteredData, columns, "contenedores.csv")}
        >
          Exportar
        </Button>
        <Button color="danger" onPress={fetchData} className="text-white" radius="full">
          Recargar
        </Button>
      </Box>
    ),
  });

  return (
    <ManiobraProvider>

      <CountContenedor
        filteredData={filteredData}
        selectedBranches={selectedBranches}
        setSelectedBranches={setSelectedBranches}
      />

      <MaterialReactTable table={table} />

      <ContenedorEdit
        open={open}
        onClose={() => {
          setOpen(false);
          fetchData();
        }}
        data={dataCP}
      />

      <Travel idViaje={idViaje} open={openViaje} handleClose={handleClose}></Travel>
    </ManiobraProvider>
  );
};

export default ContenedoresPendientes;
