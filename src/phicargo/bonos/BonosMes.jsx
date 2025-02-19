import React, { useState, useEffect, useMemo } from 'react';
import Slide from '@mui/material/Slide';
import { Box, TextField } from '@mui/material';
import odooApi from '../modules/core/api/odoo-api';
import { DatePicker, Chip } from "@nextui-org/react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { toast } from 'react-toastify';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useAuthContext } from '../modules/auth/hooks';

const BonosMes = ({ month, year }) => {

  const { session } = useAuthContext();
  const [permisosEdicion, setPermisos] = useState([]);

  const fetchPermisos = async () => {
    try {
      const response = await odooApi.get(`/users-management/permissions/` + session.user.id);
      const ids = response.data.map(permiso => permiso.permission_id);
      setPermisos(ids);
      console.log(ids);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const fetchData = async () => {
    try {
      toast.info('Obteniendo informacion');
      setIsLoading(true);
      const response = await odooApi.get(`/bonos_operadores/by_period/${month}/${year}`);
      setEditedData(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchPermisos();
    fetchData();
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState([]);

  const handleEditChange = (event, rowIndex, columnId) => {
    const newData = [...editedData];
    newData[rowIndex][columnId] = event.target.value;
    setEditedData(newData);
  };

  const guardar_bonos = async () => {
    console.log("Datos modificados:", editedData);
    try {
      setIsLoading(true);
      const response = await odooApi.post('/bonos_operadores/update_bonos/', editedData);
      if (response.data.status === "success") {
        toast.success(`✅ ${response.data.message} (${response.data.updated_records} registros)`);
        fetchData();
      }
      setIsEditing(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      setIsLoading(false);
    }
  };

  const columns = [
    {
      accessorKey: "id_bono",
      header: "ID Bono",
    },
    {
      accessorKey: "name",
      header: "Operador",
    },
    {
      accessorKey: "km_recorridos",
      header: "Km recorridos",
    },
    {
      accessorKey: "excelencia",
      header: "Excelencia",
      Cell: ({ row, cell }) =>
        isEditing && permisosEdicion.includes(12) ? (
          <TextField
            variant='standard'
            value={editedData[row.index].excelencia}
            onChange={(e) => handleEditChange(e, row.index, "excelencia")}
            size="small"
          />
        ) : (
          cell.getValue()
        ),
    },
    {
      accessorKey: "productividad",
      header: "Productividad",
      Cell: ({ row, cell }) =>
        isEditing && permisosEdicion.includes(12) ? (
          <TextField
            variant='standard'
            value={editedData[row.index].productividad}
            onChange={(e) => handleEditChange(e, row.index, "productividad")}
            size="small"
          />
        ) : (
          cell.getValue()
        ),
    },
    {
      accessorKey: "operacion",
      header: "Operacion",
      Cell: ({ row, cell }) =>
        isEditing && permisosEdicion.includes(12) ? (
          <TextField
            variant='standard'
            value={editedData[row.index].operacion}
            onChange={(e) => handleEditChange(e, row.index, "operacion")}
            size="small"
          />
        ) : (
          cell.getValue()
        ),
    },
    {
      accessorKey: "seguridad_vial",
      header: "Seguridad vial",
      Cell: ({ row, cell }) =>
        isEditing && permisosEdicion.includes(9) ? (
          <TextField
            variant='standard'
            value={editedData[row.index].seguridad_vial}
            onChange={(e) => handleEditChange(e, row.index, "seguridad_vial")}
            size="small"
          />
        ) : (
          cell.getValue()
        ),
    },
    {
      accessorKey: "cuidado_unidad",
      header: "Cuidado unidad",
      Cell: ({ row, cell }) =>
        isEditing && permisosEdicion.includes(10) ? (
          <TextField
            variant='standard'
            value={editedData[row.index].cuidado_unidad}
            onChange={(e) => handleEditChange(e, row.index, "cuidado_unidad")}
            size="small"
          />
        ) : (
          cell.getValue()
        ),
    },
    {
      accessorKey: "rendimiento",
      header: "Rendimiento",
      Cell: ({ row, cell }) =>
        isEditing && permisosEdicion.includes(10) ? (
          <TextField
            variant='standard'
            value={editedData[row.index].rendimiento}
            onChange={(e) => handleEditChange(e, row.index, "rendimiento")}
            size="small"
          />
        ) : (
          cell.getValue()
        ),
    },
    {
      accessorKey: "calificacion",
      header: "Calificación",
      Cell: ({ row, cell }) =>
        isEditing && permisosEdicion.includes(10) ? (
          <TextField
            variant='standard'
            value={editedData[row.index].calificacion}
            onChange={(e) => handleEditChange(e, row.index, "calificacion")}
            size="small"
          />
        ) : (
          cell.getValue()
        ),
    },
  ];

  const table = useMaterialReactTable({
    columns: columns,
    data: editedData,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { showProgressBars: isLoading },
    initialState: {
      isLoading: isLoading,
      density: 'compact',
      pagination: { pageSize: 80 },
    },
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
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 193px)',
      },
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button onPress={() => setIsEditing(!isEditing)} sx={{ m: 1 }} color="primary">
          {isEditing ? "Cancelar Edición" : "Editar"}
        </Button>
        {isEditing && (
          <Button color="success" onPress={guardar_bonos} sx={{ m: 1 }} className='text-white' isLoading={isLoading}>
            Guardar Cambios
          </Button>
        )}
      </Box>
    ),
  });

  return (
    <Box>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default BonosMes;
