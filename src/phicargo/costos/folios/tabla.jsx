import React, { useState, useEffect, useMemo, useContext } from 'react';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';
import { MenuItem, FormControl, InputLabel } from '@mui/material';
import { Box } from '@mui/material';
import { Button, Chip } from '@nextui-org/react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import odooApi from '@/phicargo/modules/core/api/odoo-api';
import FormularioCostoExtra from '../maniobras/form_costos_extras';
import { CostosExtrasContext } from '../context/context';
import { Select, SelectItem } from "@nextui-org/react";

const Maniobras = () => {

  const { id_folio, setIDFolio, CartasPorte, CartasPorteEliminadas, setCPS, setCPSEliminadas, CostosExtras, setCostosExtras, CostosExtrasEliminados, setCostosExtrasEliminados, formData, setFormData, DisabledForm, setDisabledForm } = useContext(CostosExtrasContext);

  const [data, setData] = useState([]);
  const [isLoading2, setLoading] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [sucursal, setSucursal] = React.useState("1");

  const seleccionar_sucursal = (e) => {
    setSucursal(e.target.value);
  };

  const limpiarForm = () => {
    setIDFolio(null);
    setCPS([]);
    setCPSEliminadas([]);
    setCostosExtras([]);
    setCostosExtrasEliminados([]);
  };

  const handleShowModal = () => {
    setModalShow(true);
  };

  const handleCloseModal = () => {
    setModalShow(false);
    fetchData();
    limpiarForm();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/folios_costos_extras/by_store_id/' + sucursal);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sucursal]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id_folio',
        header: 'Folio',
      },
      {
        accessorKey: 'empresa',
        header: 'Empresa',
      },
      {
        accessorKey: 'sucursal',
        header: 'Sucursal',
      },
      {
        accessorKey: 'fecha_creacion',
        header: 'Fecha creación',
        size: 150,
        Cell: ({ cell }) => {
          const rawDate = cell.getValue();
          const date = new Date(rawDate);

          if (isNaN(date.getTime())) {
            return "Fecha no válida";
          }

          const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          };

          const formattedDate = date.toLocaleString('es-ES', options);
          return formattedDate;
        },
      },
      {
        accessorKey: 'nombre',
        header: 'Creado por',
      },
      {
        accessorKey: 'cliente',
        header: 'Cliente',
      },
      {
        accessorKey: 'cartas_porte',
        header: 'Cartas porte',
      },
      {
        accessorKey: 'x_referencias',
        header: 'Contenedores',
      },
      {
        accessorKey: 'status',
        header: 'Estatus',
        Cell: ({ cell }) => {
          const status = cell.getValue() || '';
          let badgeClass = '';

          if (status === 'cancelado') {
            badgeClass = 'danger';
          } else if (status === 'facturado') {
            badgeClass = 'success';
          } else if (status === 'borrador') {
            badgeClass = 'warning';
          }

          return (
            <Chip color={badgeClass} size='sm' className="text-white">
              {status}
            </Chip>
          );
        },
      },
      {
        accessorKey: 'ref_factura',
        header: 'Referencia factura',
      },
      {
        accessorKey: 'total',
        header: 'Total',
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { isLoading: isLoading2 },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: "onEnd",
    initialState: {
      density: 'compact',
      showColumnFilters: true,
      pagination: { pageSize: 80 },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 220px)',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: ({ event }) => {

        if (row.subRows?.length) {
        } else {
          handleShowModal(row.original.id_folio);
          setIDFolio(row.original.id_folio);
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
    muiTableBodyCellProps: {
      sx: {
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontSize: '14px',
      },
    },

    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          alignItems: 'center',
        }}
      >
        <Box sx={{ width: '200px' }}>
          <Button
            color="primary"
            size='lg'
            fullWidth
            onPress={() => {
              handleShowModal();
              setIDFolio(null);
            }}
          >
            Nuevo folio
          </Button>
        </Box>

        <Box sx={{ width: '250px' }}>
          <Select
            label="Sucursal"
            placeholder="Selecciona una sucursal"
            selectedKeys={[sucursal]}
            onChange={seleccionar_sucursal}
            fullWidth // Hace que el Select ocupe todo el ancho del contenedor
          >
            <SelectItem key={'1'}>Veracruz</SelectItem>
            <SelectItem key={'2'}>México</SelectItem>
            <SelectItem key={'9'}>Manzanillo</SelectItem>
          </Select>
        </Box>
      </Box>

    ),
  });

  return (
    <div>
      <FormularioCostoExtra
        show={modalShow}
        handleClose={handleCloseModal}
        form_deshabilitado={true}
      />
      <MaterialReactTable table={table} />
    </div >
  );

};

export default Maniobras;
