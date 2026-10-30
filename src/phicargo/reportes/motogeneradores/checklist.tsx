
import { useEffect, useRef, useState } from "react";
import {
 Alert,
 AppBar,
 Autocomplete,
 Box,
 Card,
 CardContent,
 Chip,
 CircularProgress,
 Dialog,
 DialogActions,
 DialogContent,
 DialogTitle,
 IconButton,
 MenuItem,
 Stack,
 TextField,
 Toolbar,
 Typography,
} from "@mui/material";

import {
 CameraAlt,
 Checklist,
 Delete,
 Save,
 Close,
 Comment,
} from "@mui/icons-material";

import odooApi from "@/api/odoo-api";
import { ChecklistPatioData, ChecklistPayload, ElementoChecklist, ResultadoChecklist, Vehiculo } from "./model";
import Grid from "@mui/system/Grid";
import toast from "react-hot-toast";
import { Button } from "@heroui/react";

// Importar los tipos del archivo correspondiente
// import { Vehiculo, ElementoChecklist, ChecklistPatioData } from "./types";

interface Props {
 data?: ChecklistPatioData | null;
 onSuccess?: () => void;
}

interface ElementoLocal {
 id_elemento: number;
 nombre_elemento: string;
 estado: 1 | 0 | null;
 observaciones: string;
}

const ENDPOINTS = {
 vehicles: "/vehicles/flota/",
 checklist: "/elementos_checklist/",
 save: "/checklist/flota/",
};

export default function ChecklistPatio({
 data = null,
 onSuccess,
}: Props) {
 const [vehicles, setVehicles] = useState<Vehiculo[]>([]);
 const [selectedVehicle, setSelectedVehicle] =
  useState<Vehiculo | null>(null);

 const [elements, setElements] = useState<ElementoLocal[]>([]);

 const [mileage, setMileage] = useState("");
 const [userPin, setUserPin] = useState("");
 const [comments, setComments] = useState("");

 const [resultado, setResultado] =
  useState<ResultadoChecklist | "">("");

 const [photos, setPhotos] = useState<File[]>([]);

 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [error, setError] = useState("");

 const [open, setOpen] = useState(false);
 const [openChecklist, setOpenChecklist] = useState(false);
 const [openComments, setOpenComments] = useState(false);

 const fileInputRef = useRef<HTMLInputElement>(null);

 // --------------------------------------------------
 // CARGA DE CATÁLOGOS HTTP
 // --------------------------------------------------

 useEffect(() => {
  loadCatalogs();
 }, []);

 const loadCatalogs = async () => {
  setLoading(true);

  try {
   const [vehiclesResponse, checklistResponse] =
    await Promise.all([
     odooApi.get(ENDPOINTS.vehicles),
     odooApi.get(ENDPOINTS.checklist),
    ]);

   const vehiclesData: Vehiculo[] =
    vehiclesResponse.data.data ?? vehiclesResponse.data;

   const checklistData: ElementoChecklist[] =
    checklistResponse.data.data ?? checklistResponse.data;

   setVehicles(vehiclesData);

   if (data) {
    const vehicle = vehiclesData.find(
     (item) => item.id === Number(data.vehicle_id)
    );

    if (vehicle) {
     setSelectedVehicle(vehicle);
    }

    setMileage(String(data.mileage ?? ""));
    setUserPin(data.user_pin ?? "");
    setComments(data.comments ?? "");
    setResultado(data.resultado ?? "");

    const saved = new Map(
     (data.checklist ?? []).map((item) => [
      item.id_elemento,
      item,
     ])
    );

    setElements(
     checklistData
      .filter((item) => saved.has(item.id_elemento))
      .map((item) => {
       const previous = saved.get(item.id_elemento)!;

       return {
        id_elemento: item.id_elemento,
        nombre_elemento: item.nombre_elemento,
        estado: previous.estado,
        observaciones: previous.observaciones ?? "",
       };
      })
    );
   }
  } catch (err) {
   console.error(err);
   setError("No fue posible cargar los catálogos.");
  } finally {
   setLoading(false);
  }
 };

 // --------------------------------------------------
 // FILTRAR CHECKLIST SEGÚN VEHÍCULO
 // --------------------------------------------------

 // Para un registro nuevo, se consulta el catálogo
 // correspondiente al tipo de vehículo seleccionado.

 const loadChecklistByVehicle = async (
  vehicle: Vehiculo
 ) => {
  try {
   setLoading(true);

   const response = await odooApi.get(
    ENDPOINTS.checklist
   );

   const catalog: ElementoChecklist[] =
    response.data.data ?? response.data;

   const tipo = {
    tractor: "tractor",
    trailer: "remolque",
    dolly: "remolque",
    other: "motogenerador",
   }[vehicle.fleet_type];

   const filtered = catalog.filter(
    (item) => item.tipo_equipo === tipo
   );

   setElements(
    filtered.map((item) => ({
     id_elemento: item.id_elemento,
     nombre_elemento: item.nombre_elemento,
     estado: null,
     observaciones: "",
    }))
   );
  } catch (err) {
   console.error(err);
   setError("Error al consultar el checklist.");
  } finally {
   setLoading(false);
  }
 };

 const handleVehicleChange = async (
  vehicle: Vehiculo | null
 ) => {
  setSelectedVehicle(vehicle);

  if (!vehicle) {
   setElements([]);
   return;
  }

  if (!data) {
   await loadChecklistByVehicle(vehicle);
  }
 };

 // --------------------------------------------------
 // ACTUALIZAR ELEMENTOS
 // --------------------------------------------------

 const updateElement = (
  id: number,
  changes: Partial<ElementoLocal>
 ) => {
  setElements((previous) =>
   previous.map((item) =>
    item.id_elemento === id
     ? { ...item, ...changes }
     : item
   )
  );
 };

 const completed = elements.filter(
  (item) => item.estado !== null
 ).length;

 const progress = elements.length
  ? (completed / elements.length) * 100
  : 0;

 const pending = elements.filter(
  (item) => item.estado === null
 ).length;

 // --------------------------------------------------
 // FOTOGRAFÍAS
 // --------------------------------------------------

 const handlePhotos = (
  event: React.ChangeEvent<HTMLInputElement>
 ) => {
  const files = Array.from(event.target.files ?? []);

  setPhotos((previous) => [...previous, ...files]);

  event.target.value = "";
 };

 const removePhoto = (index: number) => {
  setPhotos((previous) =>
   previous.filter((_, i) => i !== index)
  );
 };

 const resetForm = () => {
  setSelectedVehicle(null);
  setMileage("");
  setUserPin("");
  setComments("");
  setResultado("");
  setElements([]);
  setPhotos([]);
  setOpenChecklist(false);
  setOpenComments(false);
  setError("");

  if (fileInputRef.current) {
   fileInputRef.current.value = "";
  }
 };

 // --------------------------------------------------
 // GUARDAR
 // --------------------------------------------------

 const handleSubmit = async () => {
  setError("");

  if (!selectedVehicle) {
   setError("Selecciona un vehículo.");
   return;
  }

  if (!userPin || userPin.length !== 4) {
   setError("El PIN debe contener 4 dígitos.");
   return;
  }

  if (!elements.length || pending > 0) {
   setError("Debes completar todas las revisiones.");
   return;
  }

  if (!resultado) {
   setError("Selecciona el estado de revisión.");
   return;
  }

  const payload: ChecklistPayload = {
   id_equipo: selectedVehicle.id,
   vehicle_name: selectedVehicle.name2,
   mileage: mileage.trim() || null,
   user_pin: userPin,
   tipo_checklist: "diario",
   inspection_date: new Date().toISOString(),
   resultado,
   comments,
   checklist: elements.map((item) => ({
    id_elemento: item.id_elemento,
    estado: item.estado,
    observaciones: item.observaciones,
   })),
  };

  const formData = new FormData();

  formData.append(
   "data",
   JSON.stringify(payload)
  );

  photos.forEach((photo) => {
   formData.append("files", photo);
  });

  try {
   setSaving(true);

   const response = await odooApi.post(
    ENDPOINTS.save,
    formData
   );

   if (response.data.status == "success") {
    toast.success(response.data.message);
    onSuccess?.();
    setOpen(false);
    resetForm();
   }
  } catch (err) {
   console.error(err);
   setError("No fue posible guardar el checklist.");
  } finally {
   setSaving(false);
  }
 };

 // --------------------------------------------------
 // INTERFAZ
 // --------------------------------------------------

 if (loading) {
  return (
   <Box
    display="flex"
    justifyContent="center"
    p={5}
   >
    <CircularProgress />
   </Box>
  );
 }

 return (
  <>
   <Button onPress={() => setOpen(true)} size="sm" color="primary" radius="md">Nuevo checklist</Button>
   <Dialog open={open} maxWidth="lg" onClose={() => setOpen(false)}>
    <AppBar
     elevation={0}
     sx={{
      position: 'relative',
      background: 'linear-gradient(90deg, #0b2149, #002887)',
      padding: '0 16px',
     }}
    >
     <Toolbar>
      <Typography sx={{ fontSize: '20px', textTransform: 'uppercase', flex: 1 }} variant='h3'>
       Registro de inspección de equipos
      </Typography>
      <Button autoFocus onPress={() => setOpen(false)} size="sm" radius="full">
       Cerrar
      </Button>
     </Toolbar>
    </AppBar>
    <DialogContent>
     <Box sx={{ maxWidth: 1100, mx: "auto", p: 2 }}>
      <Stack spacing={2}>

       {error && (
        <Alert
         severity="error"
         onClose={() => setError("")}
        >
         {error}
        </Alert>
       )}

       {/* DATOS GENERALES */}

       <Card variant="outlined">
        <CardContent>
         <Typography variant="h6" fontWeight={700} mb={2}>
          Datos generales
         </Typography>

         <Grid container spacing={2}>

          <Grid size={{ xs: 12, md: 6 }}>
           <Autocomplete
            options={vehicles}
            value={selectedVehicle}
            getOptionLabel={(option) =>
             option.name2 ?? ""
            }
            isOptionEqualToValue={(a, b) =>
             a.id === b.id
            }
            onChange={(_, value) =>
             handleVehicleChange(value)
            }
            renderInput={(params) => (
             <TextField
              {...params}
              label="Vehículo"
              placeholder="Buscar vehículo..."
              required
             />
            )}
           />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
           <TextField
            fullWidth
            label="Kilometraje / Horómetro"
            value={mileage}
            onChange={(e) =>
             setMileage(
              e.target.value.replace(/[^0-9.]/g, "")
             )
            }
           />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
           <TextField
            fullWidth
            label="PIN de usuario"
            value={userPin}
            type="password"
            required
            inputProps={{
             maxLength: 4,
             inputMode: "numeric",
            }}
            onChange={(e) =>
             setUserPin(
              e.target.value.replace(/\D/g, "").slice(0, 4)
             )
            }
           />
          </Grid>

         </Grid>
        </CardContent>
       </Card>

       {/* CHECKLIST */}

       <Card variant="outlined">
        <CardContent>
         <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
         >
          <Box>
           <Typography variant="h6" fontWeight={700}>
            Inspección
           </Typography>

           <Typography variant="body2" color="text.secondary">
            {completed} de {elements.length} elementos revisados
           </Typography>
          </Box>

          <Chip
           label={`${Math.round(progress)}%`}
           color={progress === 100 ? "success" : "primary"}
          />
         </Stack>

         <Box
          sx={{
           height: 8,
           bgcolor: "action.hover",
           borderRadius: 5,
           overflow: "hidden",
           mb: 2,
          }}
         >
          <Box
           sx={{
            width: `${progress}%`,
            height: "100%",
            bgcolor: "success.main",
            transition: "width .3s",
           }}
          />
         </Box>

         <Button
          color="primary"
          fullWidth
          startContent={<Checklist />}
          disabled={!selectedVehicle || !elements.length}
          onClick={() => setOpenChecklist(true)}
         >
          Revisar elementos ({elements.length})
         </Button>
        </CardContent>
       </Card>

       {/* FOTOGRAFÍAS */}

       <Card variant="outlined">
        <CardContent>
         <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
         >
          <Box>
           <Typography variant="h6" fontWeight={700}>
            Evidencias fotográficas
           </Typography>
           <Typography variant="body2" color="text.secondary">
            {photos.length} fotografías seleccionadas
           </Typography>
          </Box>

          <Button
           color="primary"
           startContent={<CameraAlt />}
           onPress={() => fileInputRef.current?.click()}
          >
           Agregar
          </Button>

          <input
           ref={fileInputRef}
           hidden
           multiple
           type="file"
           accept="image/*"
           onChange={handlePhotos}
          />
         </Stack>

         <Grid container spacing={2} mt={1}>
          {photos.map((photo, index) => (
           <Grid
            key={`${photo.name}-${index}`}
            size={{ xs: 6, sm: 4, md: 3 }}
           >
            <Box
             sx={{
              position: "relative",
              aspectRatio: "1",
             }}
            >
             <Box
              component="img"
              src={URL.createObjectURL(photo)}
              sx={{
               width: "100%",
               height: "100%",
               objectFit: "cover",
               borderRadius: 2,
              }}
             />

             <IconButton
              onClick={() => removePhoto(index)}
              sx={{
               position: "absolute",
               top: 5,
               right: 5,
               bgcolor: "background.paper",
              }}
             >
              <Delete color="error" />
             </IconButton>
            </Box>
           </Grid>
          ))}
         </Grid>
        </CardContent>
       </Card>

       {/* COMENTARIOS */}

       <Card variant="outlined">
        <CardContent>
         <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
         >
          <Box>
           <Typography variant="h6" fontWeight={700}>
            Comentarios
           </Typography>
           <Typography variant="body2" color="text.secondary">
            {comments ? "Comentario capturado" : "Sin comentarios"}
           </Typography>
          </Box>

          <Button
           color="primary"
           startContent={<Comment />}
           onPress={() => setOpenComments(true)}
          >
           {comments ? "Editar" : "Agregar"}
          </Button>
         </Stack>
        </CardContent>
       </Card>

       {/* ESTADO DE REVISIÓN */}

       <Card variant="outlined">
        <CardContent>
         <Typography variant="h6" fontWeight={700} mb={2}>
          Estado de revisión
         </Typography>

         <TextField
          select
          fullWidth
          label="Resultado"
          value={resultado}
          onChange={(e) =>
           setResultado(
            e.target.value as ResultadoChecklist
           )
          }
         >
          <MenuItem value="correcto">
           Correcto
          </MenuItem>

          <MenuItem value="danoMenor">
           Daño menor
          </MenuItem>

          <MenuItem value="danoMayor">
           Daño mayor
          </MenuItem>
         </TextField>
        </CardContent>
       </Card>

       {/* GUARDAR */}

       <Button
        color="success"
        className="text-white"
        fullWidth
        startContent={<Save />}
        disabled={saving || loading}
        onPress={handleSubmit}
       >
        {saving ? "Guardando..." : "Guardar checklist"}
       </Button>

      </Stack>

      {/* DIALOG CHECKLIST */}

      <Dialog
       open={openChecklist}
       onClose={() => setOpenChecklist(false)}
       fullWidth
       maxWidth="md"
      >
       <DialogTitle>
        <Stack
         direction="row"
         justifyContent="space-between"
         alignItems="center"
        >
         Checklist de inspección

         <IconButton onClick={() => setOpenChecklist(false)}>
          <Close />
         </IconButton>
        </Stack>
       </DialogTitle>

       <DialogContent dividers>
        <Stack spacing={2}>
         {elements.map((item, index) => (
          <Card
           key={item.id_elemento}
           variant="outlined"
          >
           <CardContent>
            <Typography fontWeight={700} mb={1}>
             {index + 1}. {item.nombre_elemento}
            </Typography>

            <Grid container spacing={1}>
             <Grid size={{ xs: 12, md: 4 }}>
              <Button
               fullWidth
               color="success"
               variant={
                item.estado === 1
                 ? "solid"
                 : "faded"
               }
               onPress={() =>
                updateElement(item.id_elemento, {
                 estado: 1,
                })
               }
              >
               Correcto
              </Button>
             </Grid>

             <Grid size={{ xs: 12, md: 4 }}>
              <Button
               fullWidth
               variant={
                item.estado === 0
                 ? "solid"
                 : "faded"
               }
               color="danger"
               onPress={() =>
                updateElement(item.id_elemento, {
                 estado: 0,
                })
               }
              >
               Daño / No cumple
              </Button>
             </Grid>

             <Grid size={{ xs: 12 }}>
              <TextField
               fullWidth
               multiline
               minRows={2}
               label="Observaciones"
               value={item.observaciones}
               onChange={(e) =>
                updateElement(item.id_elemento, {
                 observaciones: e.target.value,
                })
               }
              />
             </Grid>
            </Grid>
           </CardContent>
          </Card>
         ))}
        </Stack>
       </DialogContent>

       <DialogActions>
        <Button onClick={() => setOpenChecklist(false)}>
         Cerrar
        </Button>
       </DialogActions>
      </Dialog>

      {/* DIALOG COMENTARIOS */}

      <Dialog
       open={openComments}
       onClose={() => setOpenComments(false)}
       fullWidth
       maxWidth="sm"
      >
       <DialogTitle>Comentarios generales</DialogTitle>

       <DialogContent>
        <TextField
         fullWidth
         multiline
         minRows={5}
         value={comments}
         onChange={(e) => setComments(e.target.value)}
         placeholder="Escribe tus observaciones..."
         sx={{ mt: 1 }}
        />
       </DialogContent>

       <DialogActions>
        <Button onClick={() => setOpenComments(false)}>
         Cerrar
        </Button>

        <Button
         onPress={() => setOpenComments(false)}
        >
         Aceptar
        </Button>
       </DialogActions>
      </Dialog>

     </Box>
    </DialogContent>
   </Dialog>
  </>
 );
}
