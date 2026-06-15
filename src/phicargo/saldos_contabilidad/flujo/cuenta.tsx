import {
  Button,
} from "@heroui/react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle
} from "@mui/material";
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import odooApi from '@/api/odoo-api';
import { Cuenta } from ".";
import FlujoForm from "./form";

type Props = {
  open: boolean;
  handleClose: () => void;
  Cuenta: Cuenta;
};

const FlujosEfectivoTable = ({ open, handleClose, Cuenta }: Props) => {

  const [openForm, setOpenForm] = React.useState(false);

  const handleCloseForm = () => {
    setOpenForm(false);
    fetchData();
  };

  const handleClickOpen = () => {
    setOpenForm(true);
  };

  const [data, setData] = useState<Cuenta[]>([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get(`/payments/account_id/${Cuenta.id_cuenta}`);
      setData(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [Cuenta]);

  const columns = useMemo<MRT_ColumnDef<Cuenta>[]>(
    () => [
      {
        accessorKey: 'payment_date',
        header: 'Fecha',
      },
      {
        accessorKey: 'proveedor',
        header: 'Proveedor',
      },
      {
        accessorKey: 'concepto',
        header: 'Concepto',
      },
      {
        accessorKey: 'amount',
        header: 'Monto',
      },
      {
        accessorKey: 'comments',
        header: 'Comentarios',
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    localization: MRT_Localization_ES,
    groupedColumnMode: "remove",
    state: { showProgressBars: isLoading },
    positionToolbarAlertBanner: "bottom",
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 100 },
      showColumnFilters: true,
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
          handleClickOpen();
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
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        backgroundColor: row.getCanExpand() ? '#0456cf' : '#FFFFFF',
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
        color: row.getCanExpand() ? '#FFFFFF' : '#000000',
      },
    }),
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
          flexWrap: 'wrap',
        }}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <h6
              className="font-semibold lg:text-1xl"
            >
              {`${Cuenta?.id_cuenta ?? ''}`}
            </h6>
            <h1
              className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
            >
              {`${Cuenta?.banco ?? ''} ${Cuenta?.referencia ?? ''}`}
            </h1>
            <Button color="primary" radius="full" onPress={() => handleClickOpen()}>Agregar</Button>
          </div>
        </div>
      </Box>
    ),
  });

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen
      >
        <DialogTitle>
          {`${Cuenta?.banco ?? ''} ${Cuenta?.referencia ?? ''}`}
        </DialogTitle>
        <DialogContent dividers>
          <MaterialReactTable table={table} />
        </DialogContent>
        <DialogActions>
          <Button onPress={handleClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
      <FlujoForm open={openForm} handleClose={handleCloseForm} Cuenta={Cuenta}></FlujoForm>
    </>
  );
};

export default FlujosEfectivoTable;
