import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Input, Popover, PopoverContent, PopoverTrigger, User, useDisclosure } from "@heroui/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import { Avatar } from "@heroui/react";
import { Box } from '@mui/material';
import { Button } from "@heroui/react"
import { Chip } from "@heroui/react";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Image } from 'antd';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import odooApi from '@/api/odoo-api';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import NavbarAlmacen from '../Navbar';
import EPPForm from './form';
import { useAlmacen } from '../contexto/contexto';
import { exportToCSV } from '@/phicargo/utils/export';
import IndexProducto from './form';
import FormProducto from './form_producto';
import { useAuthContext } from '@/modules/auth/hooks';

const TablaProductos = ({ close, tipo }) => {

  const { session } = useAuthContext();
  const { data, setData } = useAlmacen();
  const [dataForm, setDataForm] = useState([]);
  const [id_epp, setIDEpp] = React.useState({});
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchData();
  };

  const [dataEquipos, setDataEquipo] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/tms_travel/inventario_equipo/');
      setDataEquipo(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorKey: 'x_name',
        header: 'Nombre',
      },
      {
        accessorKey: 'create_date',
        header: 'Fecha creación',
      },
      {
        accessorKey: 'x_tipo',
        header: 'Tipo',
      },
      {
        accessorKey: 'disponible',
        header: 'Disponible',
      },
      {
        accessorKey: 'reservado',
        header: 'Reservado',
      },
      {
        accessorKey: 'total_unidades',
        header: 'Total',
        Cell: ({ cell }) => {
          const cantidad = cell.getValue() || '0';

          return (
            <Chip className="text-white" color="primary" size="sm">
              {cantidad}
            </Chip>
          );
        }
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: dataEquipos,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { showProgressBars: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    positionGlobalFilter: "right",
    localization: MRT_Localization_ES,
    muiSearchTextFieldProps: {
      placeholder: `Buscar en solicitud`,
      sx: { minWidth: '300px' },
      variant: 'outlined',
    },
    columnResizeMode: "onEnd",
    initialState: {
      showGlobalFilter: true,
      columnVisibility: {
        empresa: false,
      },
      density: 'compact',
      expanded: true,
      showColumnFilters: true,
      pagination: { pageSize: 80 },
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
        maxHeight: 'calc(100vh - 260px)',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: ({ event }) => {
        handleClickOpen();
        setIDEpp(row.original.id);
      },
    }),
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '12px',
      },
    }),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <h1
          className="tracking-tight font-semibold lg:text-3xl bg-gradient-to-r from-[#0b2149] to-[#002887] text-transparent bg-clip-text"
        >
          Productos
        </h1>

        {session?.user.permissions.includes(218) && (
          <Button
            className='text-white'
            startContent={<i class="bi bi-plus-lg"></i>}
            color='primary'
            radius='full'
            isDisabled={false}
            onPress={async () => {
              setIDEpp(null);
              handleClickOpenF();
            }}
          >Nuevo producto
          </Button>
        )}

        <Button
          className='text-white'
          startContent={<i class="bi bi-arrow-clockwise"></i>}
          color='success'
          radius='full'
          isDisabled={false}
          onPress={() => fetchData()}
        >Actualizar
        </Button>

      </Box >
    ),
  });

  const [openF, setOpenF] = React.useState(false);

  const handleClickOpenF = () => {
    setOpenF(true);
  };

  const handleCloseF = () => {
    setOpenF(false);
  };


  return (
    <>
      <MaterialReactTable
        table={table}
      />

      <IndexProducto id_producto={id_epp} open={open} handleClose={handleClose} ></IndexProducto>

      <Dialog
        open={openF}
        onClose={handleCloseF}
        fullWidth
      >
        <DialogTitle id="responsive-dialog-title">
          {"Nuevo producto"}
        </DialogTitle>
        <DialogContent>
          <FormProducto data={dataForm} setData={setDataForm} fetchData2={fetchData} close={handleCloseF}></FormProducto>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseF}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TablaProductos;
