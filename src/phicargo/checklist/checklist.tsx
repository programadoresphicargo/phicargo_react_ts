import { Button, Chip } from "@heroui/react";
import { MRT_Cell, MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { exportToCSV } from '../utils/export';
import CustomNavbar from "@/pages/CustomNavbar";

type Resultado = 'correcto' | 'danoMenor' | 'danoMayor';

const map: Record<Resultado, string> = {
  correcto: 'Correcto',
  danoMenor: 'Daño menor',
  danoMayor: 'Daño mayor',
};

type ChecklistItem = {
  id_checklist: number;
  equipo: string;
  nombre: string;
  fecha: string;
  fecha_creacion: string;
  resultado: Resultado;
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
      const response = await odooApi.get(`/tms_travel/checklist/?tipo_checklist=diario`);
      setData(response.data);
    } catch (error: any) {
      toast.error('Error al enviar los datos: ' + (error?.message || 'Error desconocido'));
    } finally {
      setisLoading(false);
    }
  };

  const OpenChecklist = async (id_checklist: number) => {
    const url = `${odooApi.defaults.baseURL}/tms_travel/checklist/export/${id_checklist}`;
    window.open(url, "_blank");
  };

  const columns: MRT_ColumnDef<ChecklistItem>[] = [
    { accessorKey: 'id_checklist', header: 'ID' },
    {
      accessorKey: 'equipo', header: 'Equipo',
      Cell: ({ cell }: { cell: MRT_Cell<ChecklistItem> }) => {
        const value = cell.getValue<string>() || '';
        return (
          <Chip className="text-white" size="sm" color="success" radius="full">
            {value}
          </Chip>
        );
      },
    },
    { accessorKey: 'nombre', header: 'Usuario creacion' },
    { accessorKey: 'fecha', header: 'Fecha' },
    { accessorKey: 'fecha_creacion', header: 'Fecha creacion' },
    {
      accessorFn: (row: { resultado: Resultado }) => {
        return map[row.resultado];
      },
      id: 'resultado',
      header: 'Resultado',
    },
    {
      accessorKey: 'id_checklist',
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
      grouping: ['fecha_creacion'],
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
        <h1
          style={{ flex: 1 }}
          className="tracking-tight font-semibold lg:text-2xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Checklist de equipos
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
