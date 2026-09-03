import { Button, Chip } from "@heroui/react";
import { MRT_Cell, MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { exportToCSV } from '../utils/export';
import CustomNavbar from "@/pages/CustomNavbar";

type ChecklistItem = {
  id_checklist: number;
};

const Checklist = () => {

  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setisLoading(true);
      const response = await odooApi.get(`/checklist_recepcion_entrega/`);
      setData(response.data);
    } catch (error: any) {
      toast.error('Error al enviar los datos: ' + (error?.message || 'Error desconocido'));
    } finally {
      setisLoading(false);
    }
  };

  const OpenChecklist = async (id_checklist: number) => {
    const url = `${odooApi.defaults.baseURL}/checklist_recepcion_entrega/${id_checklist}`;
    window.open(url, "_blank");
  };

  const OpenOndrive = async (url: string) => {
    window.open(url, "_blank");
  };

  const columns: MRT_ColumnDef<ChecklistItem>[] = [
    { accessorKey: 'id', header: 'ID' },
    {
      accessorKey: 'vehiculo', header: 'Vehiculo',
      Cell: ({ cell }: { cell: MRT_Cell<ChecklistItem> }) => {
        const value = cell.getValue<string>() || '';
        return (
          <Chip className="text-white" size="sm" color="primary" radius="full">
            {value}
          </Chip>
        );
      },
    },
    { accessorKey: 'modelo', header: 'Modelo' },
    { accessorKey: 'usuario_creacion', header: 'Usuario creacion' },
    { accessorKey: 'created_at', header: 'Fecha creacion' },
    {
      accessorKey: 'onedrive_folder_url',
      id: 'evidencias',
      header: 'Evidencias',
      Cell: ({ cell }: { cell: MRT_Cell<ChecklistItem> }) => {
        const url = cell.getValue<string>();
        return (
          <Button className="text-white" size="sm" color="success" radius="full" onPress={() => OpenOndrive(url)}>
            <i className="bi bi-images"></i>
            Evidencias
          </Button>
        );
      },
    },
    {
      accessorKey: 'id',
      id: 'descargar',
      header: 'Descargar',
      Cell: ({ cell }: { cell: MRT_Cell<ChecklistItem> }) => {
        const id = cell.getValue<number>();
        return (
          <Button className="text-white" size="sm" color="primary" radius="full" onPress={() => OpenChecklist(id)}>
            <i className="bi bi-file-pdf"></i>
            Descargar
          </Button>
        );
      },
    },
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
    groupedColumnMode: 'remove',
    columnResizeMode: "onEnd",
    positionToolbarAlertBanner: "bottom",
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
          style={{ flex: 1 }}
          className="tracking-tight font-semibold lg:text-2xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Checklist recepción entrega
        </h1>

        <Button
          onPress={() => exportToCSV(data, columns, "checklist.csv")}
          color="success"
          className="text-white"
          radius="full"
        >
          Exportar
        </Button>

        <Button
          onPress={() => fetchData()}
          isDisabled={isLoading}
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

export default Checklist;
