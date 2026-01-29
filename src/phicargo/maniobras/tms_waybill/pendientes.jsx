import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Button, Chip } from "@heroui/react";
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
    {
      accessorKey: "x_status_bel",
      header: "Estatus",
      Cell: ({ cell }) => {
        const value = cell.getValue();
        const map = {
          sm: { color: "secondary", text: "SIN MANIOBRA" },
          pm: { color: "primary", text: "PATIO MÉXICO" },
          P: { color: "primary", text: "EN PATIO" },
          V: { color: "success", text: "EN VIAJE" },
        };

        const cfg = map[value] || { color: "danger", text: value || "N/A" };

        return (
          <Chip color={cfg.color} size="sm" className="text-white">
            {cfg.text}
          </Chip>
        );
      },
    },
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
    state: { showProgressBars: isLoading },
    initialState: {
      pagination: { pageSize: 80 },
      density: "compact",
      showColumnFilters: true,
      showGlobalFilter:true,
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
        setDataCP(row.original);
        setOpen(true);
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
        maxHeight: 'calc(100vh - 280px)',
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
      <Box sx={{ display: "flex", gap: 2 }}>
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
      <CustomNavbar pages={pages} />

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
    </ManiobraProvider>
  );
};

export default ContenedoresPendientes;
