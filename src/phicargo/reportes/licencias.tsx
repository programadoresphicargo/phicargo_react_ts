import { Button } from "@heroui/react";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { exportToCSV } from '../utils/export';
import CustomNavbar from "@/pages/CustomNavbar";

type Licencia = {
  name: string;
  tms_driver_license_expiration: string;
  dias_restantes: number;
};

const LicenciasProximasVencer = () => {

  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState<Licencia[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setisLoading(true);
      const response = await odooApi.get(`/drivers/licencias_vencidas/`);
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
      const response = await odooApi.get(`/drivers/correo_licencias_vencidas/`);
      console.log(response.data)
    } catch (error) {
      toast.error('Error al enviar los datos: ' + error);
    } finally {
      setisLoading(false);
    }
  };

  const columns = [
    { accessorKey: 'name', header: 'Operador', },
    { accessorKey: 'tms_driver_license_expiration', header: 'Fecha expiración' },
    { accessorKey: 'dias_restantes', header: 'Días restantes' },
  ];

  const table = useMaterialReactTable({
    columns,
    data,
    state: { showProgressBars: isLoading },
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    localization: MRT_Localization_ES,
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
        maxHeight: 'calc(100vh - 220px)',
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row.original?.dias_restantes <= 0
          ? '#fa022f'
          : row.subRows?.length
            ? '#0456cf'
            : '#FFFFFF',

        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',

        color: row.original?.dias_restantes <= 0
          ? '#FFFFFF'
          : row.subRows?.length
            ? '#FFFFFF'
            : '#000000',
      }
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
          className="tracking-tight font-semibold lg:text-2xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Licencias proximas a vencer
        </h1>

        <Button
          onPress={() => EnviarCorreo()}
          color="primary"
          radius="full"
        >
          Enviar correo
        </Button>

        <Button
          onPress={() => exportToCSV(data, columns, "licencias.csv")}
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

export default LicenciasProximasVencer;
