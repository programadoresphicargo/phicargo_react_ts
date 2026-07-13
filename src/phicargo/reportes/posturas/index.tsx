import { Button, Chip } from "@heroui/react";
import { MRT_Cell, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import odooApi from '@/api/odoo-api';
import { toast } from "react-toastify";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Postura } from "@/modules/vehicles/models";
import { AlertDialog } from "@/components";
import { useFinishPosturaMutation } from "@/modules/vehicles/hooks/mutations";
import { IoMdExit } from "react-icons/io";
import dayjs from "dayjs";

const ControlPosturas = () => {

  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState<Postura[]>([]);
  const [itemSelected, setItemSelected] = useState<Postura | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setisLoading(true);
      const response = await odooApi.get(`/vehicles/posturas/`);
      setData(response.data);
    } catch (error) {
      toast.error('Error al enviar los datos: ' + error);
    } finally {
      setisLoading(false);
    }
  };

  const columns = [
    { accessorKey: 'driver', header: 'Operador', },
    { accessorKey: 'vehicle', header: 'Vehiculo' },
    { accessorKey: 'start_date', header: 'Inicio' },
    { accessorKey: 'end_date', header: 'Fin' },
    { accessorKey: 'reason', header: 'Razón' },
    {
      accessorKey: 'finished', header: 'Finalizada',
      Cell: ({ cell }: { cell: MRT_Cell<Postura> }) => {
        const estado = cell.getValue();
        return (
          <Chip
            radius='full'
            size="sm"
            color={estado ? "success" : "danger"}
            className="text-white"
          >
            {estado ? "Si" : "No"}
          </Chip>
        );
      },
    },
    { accessorKey: 'by_user.nombre', header: 'Usuario creación' },
    {
      accessorKey: 'created_at',
      header: 'Fecha creación',
      Cell: ({ cell }: { cell: MRT_Cell<Postura> }) =>
        dayjs(cell.getValue<string>()).format('YYYY-MM-DD h:mma'),
    },
  ];

  const { finishPosturaMutation } = useFinishPosturaMutation();

  const onFinishPostura = (posturaId: number) => {
    if (finishPosturaMutation.isPending) return;
    finishPosturaMutation.mutate(posturaId, {
      onSuccess: () => {
        setItemSelected(null);
        fetchData();
      },
    });
  };

  const table = useMaterialReactTable({
    columns,
    data,
    state: { showProgressBars: isLoading },
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    localization: MRT_Localization_ES,
    columnResizeMode: "onEnd",
    enableRowActions: true,
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
    renderRowActions: ({ row }) => (
      <AlertDialog
        title="Terminar Postura"
        message="¿Está seguro que desea terminar la postura"
        onConfirm={() => onFinishPostura(row.original.id)}
        iconOnly
        onOpenChange={(isOpen) =>
          setItemSelected(isOpen ? row.original : null)
        }
        open={itemSelected?.id === row.original.id}
        tooltipMessage="Terminar Postrura"
        openButtonIcon={<IoMdExit className="text-xl" />}
        openDisabled={row.original.finished}
      />
    ),
    muiTableBodyCellProps: ({ row }) => {
      const finished = row.original.finished;

      if (finished == null) {
        return {
          sx: {
            backgroundColor: row.subRows?.length
              ? '#0456cf'
              : '#c8d9ff'
            ,
            color: row.subRows?.length ? '#FFFFFF' : '#000000',
            fontFamily: 'Inter',
            fontWeight: 'normal',
            fontSize: '12px',
          }
        };
      }

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
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          alignItems: 'center',
        }}
      >
        <h1 style={{ flex: 2 }}
          className="tracking-tight font-semibold lg:text-2xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Posturas
        </h1>
        <Button
          onPress={() => fetchData()}
          color="warning"
          className="text-white"
          radius="full"
          fullWidth>
          Recargar
        </Button>
      </Box >
    ),
  })

  return (
    <>
      <MaterialReactTable
        table={table}
      />
    </>
  );
};

export default ControlPosturas;
