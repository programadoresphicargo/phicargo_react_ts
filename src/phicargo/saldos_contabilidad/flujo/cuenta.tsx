import {
  Button,
} from "@heroui/react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
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
import { exportToCSV } from "@/phicargo/utils/export";
import ImportarArchivoExcel from "./archivo";

type Props = {
  open: boolean;
  handleClose: () => void;
  Cuenta: Cuenta;
  dateStart: string;
  dateEnd: string;
};

type Flujo = {
  id: number | null;
  importe: number | null;
};

const FlujosEfectivoTable = ({ open, handleClose, Cuenta, dateStart, dateEnd }: Props) => {

  const [openForm, setOpenForm] = React.useState(false);
  const [openFile, setOpenFile] = React.useState(false);

  const [paymentId, setPayment] = React.useState<number | null>(null);

  const handleCloseForm = () => {
    setOpenForm(false);
    fetchData();
  };

  const handleClickOpen = () => {
    setOpenForm(true);
  };

  const handleCloseFiles = () => {
    setOpenFile(false);
    fetchData();
  };

  const [data, setData] = useState<Flujo[]>([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get(`/payments/account_id/${Cuenta.id_cuenta}`, {
        params: {
          start_date: dateStart,
          end_date: dateEnd
        }
      });
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

  const total = useMemo(
    () =>
      data.reduce(
        (sum, item) => sum + Number(item.importe || 0),
        0
      ),
    [data]
  );

  const columns = useMemo<MRT_ColumnDef<Flujo>[]>(
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
        accessorKey: 'importe',
        header: 'Importe',
        Cell: ({ cell }) =>
          Number(cell.getValue()).toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN',
          }),
        Footer: () =>
          `Total: ${total.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN',
          })}`,
        muiTableHeadCellProps: {
          align: 'right',
        },
        muiTableBodyCellProps: {
          align: 'right',
        },
        muiTableFooterCellProps: {
          align: 'right',
          sx: {
            fontWeight: 'bold',
            fontSize: '20px',
          },
        },
      },
      {
        accessorKey: 'comments',
        header: 'Comentarios',
      },
    ],
    [total]
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
    enableStickyFooter: true,
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
          setPayment(row.original.id)
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
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          p: 1,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {/* Información */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} fontFamily={"Inter"}>
            ID: {Cuenta?.id_cuenta ?? ''}
          </Typography>

          <Typography
            variant="h4"
            fontWeight={700}
            fontFamily={"Inter"}
            sx={{
              background:
                'linear-gradient(to right, #0b2149, #002887)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {`${Cuenta?.banco ?? ''} ${Cuenta?.referencia ?? ''}`}
          </Typography>

          <Typography variant="body1" fontWeight={600} fontFamily={"Inter"}>
            Periodo: {dateStart} - {dateEnd}
          </Typography>
        </Box>

        {/* Botones */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
          }}
        >
          <Button
            color="primary"
            radius="full"
            onPress={() => {
              handleClickOpen();
              setPayment(null);
            }}
          >
            Agregar
          </Button>

          <Button
            color="success"
            radius="full"
            className="text-white"
            onPress={fetchData}
          >
            Recargar
          </Button>

          <Button
            radius="full"
            color="warning"
            className="text-white"
            startContent={<i className="bi bi-file-earmark-excel"></i>}
            onPress={() =>
              exportToCSV(data, columns, `flujo_${Cuenta?.banco}_${Cuenta?.referencia}_${dateStart}_${dateEnd}.csv`)
            }
          >
            Exportar
          </Button>
          <Button onPress={() => setOpenFile(true)} radius="full" color="danger">Importar</Button>
        </Box>
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
        <DialogContent dividers>
          <MaterialReactTable table={table} />
        </DialogContent>
        <DialogActions>
          <Button onPress={handleClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
      <FlujoForm open={openForm} handleClose={handleCloseForm} Cuenta={Cuenta} paymentId={paymentId}></FlujoForm>
      <ImportarArchivoExcel accoundId={Cuenta?.id_cuenta} handleClose={handleCloseFiles} open={openFile} ></ImportarArchivoExcel>
    </>
  );
};

export default FlujosEfectivoTable;
