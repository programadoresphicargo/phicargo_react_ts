import React, { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import odooApi from '@/api/odoo-api';
import { DatePicker, Textarea, Button } from '@heroui/react';
import Autocomplete from '@mui/material/Autocomplete';
import { useMinutas } from './context';
import dayjs from "dayjs";
import { parseDate } from "@internationalized/date";

const TareasMinutas = ({ estado }) => {
  const [data, setData] = useState([]);
  const [isLoading2, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const { tareas, setRecords, isEditing, setIsEditing, nuevas_tareas, setNuevasTareas, actualizadas_tareas, setActualizadasTareas, eliminadas_tareas, setEliminadasTareas } = useMinutas();

  const [newRecord, setNewRecord] = useState({
    descripcion: "",
    responsables: [],
    fecha_compromiso: null,
  });

  const [editingRecord, setEditingRecord] = useState(null);

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
      setNuevasTareas((prev) => [...prev, newRecordWithId]); // 🔹 Registrar nueva tarea
    } else {
      setRecords((prev) =>
        prev.map((r) => (r.id_tarea === editingRecord.id_tarea ? editingRecord : r))
      );

      // 🔹 Evita duplicados en actualizadas_tareas
      setActualizadasTareas((prev) => {
        const yaExiste = prev.some((t) => t.id_tarea === editingRecord.id_tarea);
        if (yaExiste) {
          return prev.map((t) => (t.id_tarea === editingRecord.id_tarea ? editingRecord : t));
        } else {
          return [...prev, editingRecord];
        }
      });
    }

    // limpiar y cerrar modal
    setNewRecord({ descripcion: "", responsables: [], fecha_compromiso: null });
    setEditingRecord(null);
    setOpenDialog(false);
  };

  // 🔹 Eliminar registro
  const handleDelete = (row) => {
    setRecords((prev) => prev.filter((r) => r.id_tarea !== row.id_tarea));

    // Si es una tarea recién creada (no en BD), la quitamos de nuevas_tareas
    setNuevasTareas((prev) => prev.filter((t) => t.id_tarea !== row.id_tarea));

    // Si ya existía (tiene id de BD), la agregamos a eliminadas_tareas
    if (String(row.id_tarea).length < 13) {
      // asumiendo que los id_tarea de BD son más cortos que los Date.now()
      setEliminadasTareas((prev) => [...prev, row]);
    }
  };

  const columns = useMemo(() => [
    { accessorKey: 'descripcion', header: 'Descripción' },
    {
      accessorKey: 'responsables',
      header: 'Responsables',
      Cell: ({ row }) => {
        const responsables = row.original.responsables;
        return (
          <div style={{ whiteSpace: 'pre-line' }}>
            {responsables && responsables.length > 0
              ? responsables.map(p => p.empleado).join(",\n")
              : "Sin responsables"}
          </div>
        );
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
        <div className="flex gap-2">
          <Button
            onPress={() => {
              setEditingRecord(row.original);
              setOpenDialog(true);
            }}
            color="primary"
            radius="full"
            size="sm"
            isDisabled={!isEditing}
          >
            Editar
          </Button>
          <Button
            onPress={() => handleDelete(row.original)}
            color="danger"
            radius="full"
            size="sm"
            isDisabled={!isEditing}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ], [isEditing]);

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
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100vh - 210px)',
      },
    },
  });

  return (
    <div>
      {/* Botón para sincronizar con backend */}
      <Box sx={{ p: 2 }}>
        <Button
          onPress={() => setOpenDialog(true)}
          color="secondary"
          radius="full"
          isDisabled={!isEditing}
        >
          Nueva tarea
        </Button>
      </Box>

      {/* Modal agregar/editar */}
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
              hideTimeZone
              showMonthAndYearPickers
              label="Fecha Compromiso"
              fullWidth
              defaultValue={editingRecord
                ? parseDate("2024-01-01")
                : parseDate("2024-01-01")}
              onChange={(date) => {
                if (!date) return;
                const formattedDate = dayjs(date).format("YYYY-MM-DD");
                if (editingRecord) {
                  setEditingRecord((prev) => ({ ...prev, fecha_compromiso: formattedDate }));
                } else {
                  setNewRecord((prev) => ({ ...prev, fecha_compromiso: formattedDate }));
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
