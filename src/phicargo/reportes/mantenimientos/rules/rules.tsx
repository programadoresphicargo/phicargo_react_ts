import { Button } from "@heroui/react";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import MaintenanceRuleForm from "./rule_form";

type MaintenanceRules = {
  id: number;
}

const MaintenanceRules = () => {

  const [open, setOpen] = useState(false);
  const [idRule, setRule] = useState<number | null>(null);
  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState<MaintenanceRules[]>([]);

  useEffect(() => {
    fetchData();
  }, [open]);

  const fetchData = async () => {
    try {
      setisLoading(true);
      const response = await odooApi.get(`/maintenances/rules/`);
      setData(response.data);
    } catch (error) {
      toast.error('Error al enviar los datos: ' + error);
    } finally {
      setisLoading(false);
    }
  };

  const columns = [
    { accessorKey: 'marca', header: 'Marca' },
    { accessorKey: 'modelo', header: 'Modelo', },
    { accessorKey: 'intervalo_km', header: 'Intervalo KM' },
    { accessorKey: 'tipo_mantenimiento', header: 'Tipo de mantenimiento' },
    { accessorKey: 'created_at', header: 'Fecha creación' },
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
        maxHeight: 'calc(100vh - 200px)',
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row.subRows?.length ? '#0456cf' : '#FFFFFF',
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '12px',
        padding: '4px 8px',
        color: row.subRows?.length ? '#FFFFFF' : '#000000',
      },
    }),
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        setOpen(true);
        setRule(row.original.id);
        console.log(open);
      },
      style: {
        cursor: 'pointer',
      },
    }),
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'nowrap',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <h1
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Reglas de mantenimiento
        </h1>
        <Button color="success"
          onPress={() => {
            setOpen(true);
            setRule(null)
          }}
          className="text-white" radius="full" size="sm">Nueva</Button>
        <Button color="primary" onPress={() => fetchData()} className="text-white" radius="full" size="sm">Recargar</Button>
      </Box >
    ),
  })

  return (
    <>
      <MaterialReactTable
        table={table}
      />
      <MaintenanceRuleForm open={open} setOpen={setOpen} id={idRule}></MaintenanceRuleForm>
    </>
  );
};

export default MaintenanceRules;
