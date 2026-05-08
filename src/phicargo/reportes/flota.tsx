import { Button, } from "@heroui/react";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { exportToCSV } from '../utils/export';
import CustomNavbar from "@/pages/CustomNavbar";

const Flota = () => {

  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setisLoading(true);
      const response = await odooApi.get(`/vehicles/flota/`);
      setData(response.data);
    } catch (error) {
      toast.error('Error al enviar los datos: ' + error);
    } finally {
      setisLoading(false);
    }
  };

  const EnviarCorreo = async () => {
    try {
      setisLoading(true);
      const response = await odooApi.get(`/vehicles/correo_flota/`);
      console.log(response.data);
    } catch (error) {
      toast.error('Error al enviar los datos: ' + error);
    } finally {
      setisLoading(false);
    }
  };

  const columns = [
    { accessorKey: 'name2', header: 'Vehiculo' },
    { accessorKey: 'serial_number', header: 'Número de Serie' },
    { accessorKey: 'categoria', header: 'Categoría' },
    { accessorKey: 'modelo', header: 'Modelo' },
    { accessorKey: 'marca', header: 'Marca' },
    { accessorKey: 'model_year', header: 'Año' },
    { accessorKey: 'fleet_type', header: 'Tipo' },
    { accessorKey: 'x_tipo_vehiculo', header: 'Tipo' },
    { accessorKey: 'x_tipo_carga', header: 'Tipo de carga' },
    { accessorKey: 'x_modalidad', header: 'Modalidad' },
    { accessorKey: 'x_dueno', header: 'Dueño' },
  ];

  const table = useMaterialReactTable({
    columns,
    data,
    state: { showProgressBars: isLoading },
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    enableBottomToolbar: true,
    localization: MRT_Localization_ES,
    groupedColumnMode: "remove",
    positionToolbarAlertBanner: "bottom",
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 80 },
      showColumnFilters: true,
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
        maxHeight: 'calc(100vh - 200px)',
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row.subRows?.length ? '#0456cf' : '#FFFFFF',
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
        <h1 style={{ flex: 1 }}
          className="tracking-tight font-semibold lg:text-2xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Flota
        </h1>

        <Button
          onPress={() => EnviarCorreo()}
          color="primary"
          radius="full"
        >
          Enviar correo
        </Button>

        <Button
          onPress={() => exportToCSV(data, columns, "flota.csv")}
          color="success"
          className="text-white"
          radius="full"
        >
          Exportar
        </Button>

        <Button
          onPress={() => fetchData()}
          color="warning"
          className="text-white"
          radius="full"
        >
          Recargar
        </Button>
      </Box>
    ),
  })

  return (
    <>
      <CustomNavbar></CustomNavbar>
      <MaterialReactTable
        table={table}
      />
    </>
  );
};

export default Flota;
