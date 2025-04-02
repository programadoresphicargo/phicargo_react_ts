import { Button, Chip } from "@heroui/react";
import { FormControl, InputLabel, MenuItem } from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Select, SelectItem } from "@heroui/react";

import { Box } from '@mui/material';
import { CostosExtrasContext } from '@/phicargo/costos/context/context';
import FormularioCostoExtra from '@/phicargo/costos/maniobras/form_costos_extras';
import { TextField } from '@mui/material';
import { ViajeContext } from '../context/viajeContext';
import dayjs from 'dayjs';
import odooApi from '@/api/odoo-api';

const FoliosCostosExtrasViaje = () => {

  const { id_viaje, getHistorialEstatus, getViaje } = useContext(ViajeContext);
  const { id_folio, setIDFolio, CartasPorte, CartasPorteEliminadas, setCPS, setCPSEliminadas, CostosExtras, setCostosExtras, CostosExtrasEliminados, setCostosExtrasEliminados, formData, setFormData, DisabledForm, setDisabledForm, agregarConcepto, setAC } = useContext(CostosExtrasContext);

  const [data, setData] = useState([]);
  const [isLoading2, setLoading] = useState();
  const [modalShow, setModalShow] = useState(false);

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
      const response = await odooApi.get('/folios_costos_extras/by_travel_id/' + id_viaje);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id_viaje]);

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
            fullWidth
            onPress={() => {
              handleShowModal();
              setIDFolio(null);
              setAC(true);
            }}
          >
            Nuevo folio
          </Button>
        </Box>
      </Box>

    ),
  });

  return (
    <div>
      <FormularioCostoExtra
        show={modalShow}
        handleClose={handleCloseModal}
      />
      <MaterialReactTable table={table} />
    </div >
  );

};

export default FoliosCostosExtrasViaje;
