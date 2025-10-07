import React, { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import odooApi from '@/api/odoo-api';
import { DatePicker, Textarea } from '@heroui/react';
import { Button } from '@heroui/react';
import Autocomplete from '@mui/material/Autocomplete';
import { useMinutas } from './context';

const TareasMinutas = ({ estado }) => {
  const [data, setData] = useState([]);
  const [isLoading2, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const { tareas, setRecords, isEditing, setIsEditing } = useMinutas();

  const [newRecord, setNewRecord] = useState({
    descripcion: "",
    responsables: [],
    fecha_compromiso: null,
  });

  const [editingRecord, setEditingRecord] = useState(null); // null = crear, objeto = editar

  const [errors, setErrors] = useState({
    descripcion: false,
    responsables: false,
    fecha_compromiso: false,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await odooApi.get('/drivers/employees/');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNewRecordChange = (e) => {
    const { name, value } = e.target;
    if (editingRecord) {
      setEditingRecord((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewRecord((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSave = () => {
    const recordToValidate = editingRecord || newRecord;

    const newErrors = {
      descripcion: recordToValidate.descripcion.trim() === "",
      responsables: !recordToValidate.responsables || recordToValidate.responsables.length === 0,
      fecha_compromiso: !recordToValidate.fecha_compromiso,
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(v => v)) return;

    if (!editingRecord) {
      const newRecordWithId = {
        ...newRecord,
        id_tarea: Date.now(), // id temporal
      };
      setRecords((prev) => [...prev, newRecordWithId]);
    } else {
      setRecords((prev) =>
        prev.map((r) => (r.id_tarea === editingRecord.id_tarea ? editingRecord : r))
      );
    }

    // limpiar campos y cerrar modal
    setNewRecord({ descripcion: "", responsables: [], fecha_compromiso: null });
    setEditingRecord(null);
    setOpenDialog(false);
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'descripcion',
      header: 'Descripción',
    },
    {
      accessorKey: 'responsables',
      header: 'Responsables',
      Cell: ({ row }) => {
        const responsables = row.original.responsables;
        return responsables && responsables.length > 0
          ? responsables.map(p => p.empleado).join(", ")
          : "Sin responsables";
      },
    },
    {
      accessorKey: 'fecha_compromiso',
      header: 'Fecha Compromiso',
      Cell: ({ row }) => {
        const fecha = row.original.fecha_compromiso;
        if (!fecha) return "Sin fecha";
        const fechaObj = new Date(fecha);
        return fechaObj.toLocaleDateString("es-MX", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      Cell: ({ row }) => (
        <Button
          onPress={() => {
            setEditingRecord(row.original); // cargar datos en modal
            setOpenDialog(true);
          }}
          color="primary"
          radius="full"
          size='sm'
          isDisabled={!isEditing}
        >
          Editar
        </Button>
      ),
    },
  ], []);

  const table = useMaterialReactTable({
    columns,
    data: tareas,
    getRowId: (row) => row.id_tarea,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { showProgressBars: isLoading2 },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: 'onEnd',
    initialState: { density: 'compact', pagination: { pageSize: 80 } },
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
          flexWrap: 'wrap',
        }}
      >
        <Button
          onPress={() => { setEditingRecord(null); setOpenDialog(true); }}
          color="secondary"
          radius="full"
          isDisabled={!isEditing}
        >
          Agregar tarea
        </Button>
      </Box>
    ),
  });

  return (
    <div>

      {/* Modal para agregar/editar */}
      <Dialog open={openDialog} maxWidth="lg" onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editingRecord ? "Editar Registro" : "Agregar Nuevo Registro"}</DialogTitle>
        <DialogContent>
          <div className="w-full flex flex-col gap-4">
            <Textarea
              fullWidth
              label="Descripción"
              name="descripcion"
              value={editingRecord ? editingRecord.descripcion : newRecord.descripcion}
              onChange={handleNewRecordChange}
              isInvalid={errors.descripcion}
              errorMessage={errors.descripcion && "La descripción es obligatoria"}
            />

            <Autocomplete
              multiple
              options={data}
              getOptionLabel={(option) => option.empleado}
              value={editingRecord ? editingRecord.responsables : newRecord.responsables}
              onChange={(event, newValue) => {
                if (editingRecord) {
                  setEditingRecord((prev) => ({ ...prev, responsables: newValue }));
                } else {
                  setNewRecord((prev) => ({ ...prev, responsables: newValue }));
                }
                setErrors((prev) => ({ ...prev, responsables: false }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Responsables"
                  placeholder="Selecciona responsables"
                  error={errors.responsables}
                  helperText={errors.responsables && "Selecciona al menos un participante"}
                />
              )}
            />

            <DatePicker
              label="Fecha Compromiso"
              fullWidth
              value={editingRecord ? editingRecord.fecha_compromiso : newRecord.fecha_compromiso}
              onChange={(date) => {
                if (editingRecord) {
                  setEditingRecord((prev) => ({ ...prev, fecha_compromiso: date }));
                } else {
                  setNewRecord((prev) => ({ ...prev, fecha_compromiso: date }));
                }
                setErrors((prev) => ({ ...prev, fecha_compromiso: false }));
              }}
              isInvalid={errors.fecha_compromiso}
              errorMessage={errors.fecha_compromiso && "La fecha es obligatoria"}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onPress={() => setOpenDialog(false)} color="secondary" radius="full">
            Cancelar
          </Button>
          <Button onPress={handleSave} color="primary" radius="full">
            {editingRecord ? "Guardar" : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>

      <MaterialReactTable table={table} />
    </div>
  );
};

export default TareasMinutas;
