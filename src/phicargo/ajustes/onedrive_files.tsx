import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { Button } from '@heroui/react';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { DateRangePicker } from 'rsuite';
import { exportToCSV } from '../utils/export';
import CustomNavbar from '@/pages/CustomNavbar';
import { pages } from "./pages";
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

type Archivo = {
  id_archivo: number;
  id_onedrive: string;
}

const OnedriveFiles = ({ }) => {

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [range, setRange] = useState<[Date, Date] | null>([firstDay, lastDay]);

  const [data, setData] = useState<Archivo[]>([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!range) return;
    try {
      setLoading(true);
      const response = await odooApi.get('/archivos/', {
        params: {
          start_date: range[0].toISOString().slice(0, 10),
          end_date: range[1].toISOString().slice(0, 10)
        }
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Error al obtener los datos:' + error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id_archivo',
        header: 'ID',
      },
      {
        accessorKey: 'filename',
        header: 'Nombre',
      },
      {
        accessorKey: 'fecha_creacion',
        header: 'Fecha creacion',
      },
      {
        accessorKey: 'tabla',
        header: 'Origen',
      },
      {
        accessorKey: 'tipo_archivo',
        header: 'Tipo archivo',
      },
      {
        accessorKey: 'id_onedrive',
        header: 'Onedrive',
      },
    ],
    [],
  );

  const confirmApproved = async (id_archivo: number) => {
    const result = await Swal.fire({
      title: "¿Borrar archivo?",
      text: "La acción no se podra revertir",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, aprobar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: status == "approved" ? "#16a34a" : "#dc2626",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);

      let response = await odooApi.delete(
        `/archivos/${id_archivo}`,
      );

      Swal.fire({
        icon: "success",
        title: response.data == true ? "Archivo eliminado" : "Error al eliminar archivo",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchData(); // Recargar información si es necesario
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Ocurrió un error",
        text:
          error.response?.data?.message ??
          error.message ??
          "No fue posible realizar la acción.",
      });
    } finally {
      setLoading(false);
    }
  };

  const obtenerUrlPublico = async (idOnedrive: string) => {
    try {
      const response = await odooApi.get('/onedrive/generate_link/' + idOnedrive);
      if (response.data.url) {
        window.open(response.data.url, '_blank');
      } else {
        toast.error('No se pudo obtener el enlace del archivo.' + response.data);
      }
    } catch (error) {
      console.error('Error al obtener el enlace público:', error);
      toast.error('Hubo un error al intentar obtener el enlace.');
    }
  };

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { showProgressBars: isLoading },
    groupedColumnMode: 'remove',
    positionToolbarAlertBanner: "bottom",
    enableColumnPinning: true,
    columnResizeMode: "onEnd",
    localization: MRT_Localization_ES,
    enableRowActions: true,
    positionActionsColumn: "last",
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
    renderRowActions: ({ row }) => (
      <>
        <IconButton onClick={() => confirmApproved(row.original.id_archivo)}>
          <DeleteIcon />
        </IconButton>
        <IconButton onClick={() => obtenerUrlPublico(row.original.id_onedrive)}>
          <VisibilityIcon />
        </IconButton>
      </>
    ),
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        const isGrouped = row.getIsGrouped();
        if (isGrouped) return;

        const selection = window.getSelection()?.toString();
        if (selection) return;

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
    muiTopToolbarProps: {
      sx: {
        background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
        color: 'white',
        '& .MuiSvgIcon-root': {
          color: 'white',   // 🎨 iconos en blanco
        },
        '& .MuiButton-root': {
          color: 'white',   // texto de botones en blanco
        },
        '& .MuiInputBase-root': {
          color: 'white',   // texto del buscador
        },
        '& .MuiInputBase-root .MuiSvgIcon-root': {
          color: 'white',   // icono de lupa en blanco
        },
      },
    },
    muiTableBodyCellProps: ({ row }) => {
      return {
        sx: {
          backgroundColor: row.subRows?.length ? '#0456cf' : '#FFFFFF',
          color: row.subRows?.length ? '#FFFFFF' : '#000000',
          fontFamily: 'Inter',
          fontWeight: 'normal',
          fontSize: '12px',
        },
      };
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 200px)',
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
          className="font-semibold lg:text-2xl"
        >
          Archivos
        </h1>

        <DateRangePicker
          value={range}
          onChange={(value) => setRange(value)}
          placeholder="Selecciona un rango de fechas"
          format="yyyy-MM-dd"
          loading={isLoading}
        />

        <Button
          color='success'
          className='text-white'
          startContent={<i className="bi bi-file-earmark-excel"></i>}
          onPress={() => exportToCSV(data, columns, "onedrive_files.csv")}
          radius='full'>
          Exportar
        </Button>
      </Box>
    ),
  });

  return (
    <>
      <CustomNavbar pages={pages} />
      <MaterialReactTable
        table={table}
      />
    </>
  );
};

export default OnedriveFiles;
