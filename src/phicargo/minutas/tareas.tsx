import { useEffect, useState } from 'react';
import { MRT_ColumnDef, MRT_Row, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import odooApi from '@/api/odoo-api';
import { Button, Textarea } from '@heroui/react';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove, UseFieldArrayUpdate } from 'react-hook-form';
import { Minuta, Tarea } from './minutas';
import { Box } from '@mui/system';
import { AppBar, Autocomplete, Dialog, DialogActions, DialogContent, TextField, Toolbar, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

type Props = {
  fields: FieldArrayWithId<Minuta, "tareas", "fieldId">[];
  append: UseFieldArrayAppend<Minuta, "tareas">;
  remove: UseFieldArrayRemove;
  update: UseFieldArrayUpdate<Minuta, "tareas">;
  isEditing: boolean;
};

const TareasMinutas = ({
  fields,
  append,
  remove,
  update,
  isEditing,
}: Props) => {

  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleNew = () => {
    setEditIndex(null);
    setOpenDialog(true);
  };

  const emptyForm: Tarea = {
    id_tarea: 0,
    descripcion: "",
    responsables: [],
    fecha_compromiso: null,
  };

  const [form, setForm] = useState<Tarea>(emptyForm);

  const handleEdit = (row: Tarea, index: number) => {
    setOpenDialog(true);
    setEditIndex(index);

    setForm({
      id_tarea: row.id_tarea,
      descripcion: row.descripcion,
      responsables: row.responsables ?? [],
      fecha_compromiso: row.fecha_compromiso,
    });
  };

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

  const handleChange = (name: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setOpenDialog(false);
    setEditIndex(null);
    setForm(emptyForm);
  };

  const handleSave = () => {
    if (
      !form.descripcion.trim() ||
      !form.fecha_compromiso ||
      form.responsables.length === 0
    ) {
      return;
    }

    if (editIndex !== null) {
      update(editIndex, form);
    } else {
      append({
        ...form,
        id_tarea: Date.now(),
      });
    }

    handleClose();
  };

  const handleDelete = (index: number) => {
    remove(index);
  };

  const columns: MRT_ColumnDef<Tarea>[] = [
    { accessorKey: 'descripcion', header: 'Descripción' },
    {
      accessorKey: 'responsables',
      header: 'Responsables',
      Cell: ({ row }: { row: MRT_Row<Tarea> }) => {
        const responsables = row.original.responsables;
        return (
          <div style={{ whiteSpace: 'pre-line' }}>
            {responsables && responsables.length > 0 ? (
              responsables.map((p, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <i className="bi bi-person-fill"></i> {p.empleado}
                </div>
              ))
            ) : (
              "Sin responsables"
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'fecha_compromiso',
      header: 'Fecha Compromiso',
    },
    {
      id: 'actions',
      header: 'Acciones',
      Cell: ({ row }: { row: MRT_Row<Tarea> }) => (
        <div className="flex gap-2">
          <Button
            onPress={() => handleEdit(row.original, row.index)}
            color="primary"
            radius="full"
            isDisabled={!isEditing}
          >
            <i className="bi bi-pencil-square"></i>  Editar
          </Button>
          <Button
            onPress={() => handleDelete(row.index)}
            color="danger"
            radius="full"
            isDisabled={!isEditing}
          >
            <i className="bi bi-x-circle"></i> Eliminar
          </Button>
        </div>
      ),
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: fields,
    getRowId: (row) => String(row.id_tarea),
    localization: MRT_Localization_ES,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFilters: true,
    state: { showProgressBars: isLoading },
    enableColumnPinning: true,
    enableStickyHeader: true,
    columnResizeMode: 'onEnd',
    initialState: { density: 'compact', pagination: { pageIndex: 0, pageSize: 80 } },
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
          onPress={() => handleNew()}
          color="secondary"
          radius="full"
          isDisabled={!isEditing}
        >
          <i className="bi bi-plus-circle"></i> Nueva tarea
        </Button>
      </Box>

      {/* Modal agregar/editar */}
      <Dialog
        open={openDialog}
        onClose={() => handleClose()}
        fullWidth        // ✅ agrega esto
        maxWidth="md"    // ✅ ahora sí se aplica
      >
        <AppBar
          elevation={0}
          position="static"
          sx={{
            background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
            padding: '0 16px',
          }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {editIndex ? "Editar tarea" : "Agregar nueva tarea"}
            </Typography>
            <Button autoFocus onPress={() => handleClose()}>
              Cerrar
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <div className="w-full flex flex-col gap-4">
            <Textarea
              name="descripcion"
              value={form.descripcion}
              onChange={(e) => handleChange("descripcion", e.target.value)}
            />

            <Autocomplete
              multiple
              options={data}
              getOptionLabel={(o) => o.empleado}
              value={form.responsables}
              onChange={(e, value) => handleChange("responsables", value)}
              renderInput={(params) => (
                <TextField {...params} label="Responsables" />
              )}
            />

            <DatePicker
              label="Fecha compromiso"
              value={form.fecha_compromiso ? dayjs(form.fecha_compromiso) : null}
              onChange={(value) =>
                handleChange(
                  'fecha_compromiso',
                  value ? value.format('YYYY-MM-DD') : null
                )
              }
            />

          </div>
        </DialogContent>
        <DialogActions>
          <Button onPress={() => handleClose()} color="secondary" radius="full">
            Cancelar
          </Button>
          <Button onPress={handleSave} color="primary" radius="full">
            {editIndex !== null ? "Guardar" : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>

      <MaterialReactTable table={table} />
    </div>
  );
};

export default TareasMinutas;
