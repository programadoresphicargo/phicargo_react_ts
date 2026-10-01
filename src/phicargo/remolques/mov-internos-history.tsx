import {
 Box,
 Chip,
 CircularProgress,
 DialogContent,
 Stack,
 Typography,
} from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import HistoryIcon from "@mui/icons-material/History";
import TripOriginOutlinedIcon from "@mui/icons-material/TripOriginOutlined";

import { useEffect, useState } from "react";
import odooApi from "@/api/odoo-api";

interface MovimientoLocal {
 id: number;
 vehicle_id: number;
 driver_id: number | null;
 trailer1_id: number | null;
 trailer2_id: number | null;
 dolly_id: number | null;
 date: string;
 created_by: number | null;
 created_at: string;
 comentarios: string | null;
 type: string;
 driver: string | null;
 vehicle: string | null;
 trailer1_name: string | null;
 trailer2_name: string | null;
 dolly_name: string | null;
}

interface MovimientosLocalesDialogProps {
 vehicleId: number | null;
}

const formatDate = (date: string) => {
 if (!date) return "-";

 const [year, month, day] = date.split("-");

 return `${day} /${month}/${year} `;
};

const formatDateTime = (date: string) => {
 if (!date) return "-";

 const parsedDate = new Date(date);

 if (Number.isNaN(parsedDate.getTime())) {
  return date;
 }

 return parsedDate.toLocaleString("es-MX", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
 });
};

const getTypeStyle = (type: string) => {
 const value = type?.toLowerCase() ?? "";

 if (value.includes("prueba")) {
  return {
   background: "#EFF6FF",
   color: "#1D4ED8",
   border: "#BFDBFE",
  };
 }

 if (
  value.includes("practica") ||
  value.includes("práctica")
 ) {
  return {
   background: "#F0FDF4",
   color: "#15803D",
   border: "#BBF7D0",
  };
 }

 if (value.includes("viaje")) {
  return {
   background: "#FFF7ED",
   color: "#C2410C",
   border: "#FED7AA",
  };
 }

 if (
  value.includes("maniobra") ||
  value.includes("maniobras")
 ) {
  return {
   background: "#F5F3FF",
   color: "#6D28D9",
   border: "#DDD6FE",
  };
 }

 return {
  background: "#F8FAFC",
  color: "#475569",
  border: "#E2E8F0",
 };
};

interface EquipmentBadgeProps {
 label: string;
 value: string | null;
}

const EquipmentBadge = ({
 label,
 value,
}: EquipmentBadgeProps) => {
 if (!value) return null;

 return (
  <Box
   sx={{
    display: "flex",
    alignItems: "center",
    gap: 0.7,
    px: 1.1,
    py: 0.65,
    borderRadius: 1.5,
    backgroundColor: "#FFFFFF",
    border: "1px solid #E2E8F0",
    minWidth: 0,
   }}
  >
   <Typography
    sx={{
     fontSize: 12,
     fontWeight: 700,
     color: "#94A3B8",
     textTransform: "uppercase",
     letterSpacing: 0.3,
     flexShrink: 0,
     fontFamily: "Inter, sans-serif",
    }}
   >
    {label}
   </Typography>

   <Typography
    sx={{
     fontSize: 14,
     fontWeight: 600,
     color: "#334155",
     overflow: "hidden",
     textOverflow: "ellipsis",
     whiteSpace: "nowrap",
     fontFamily: "Inter, sans-serif",
    }}
   >
    {value}
   </Typography>
  </Box>
 );
};

export default function MovimientosLocalesDialog({
 vehicleId,
}: MovimientosLocalesDialogProps) {
 const [movimientos, setMovimientos] = useState<
  MovimientoLocal[]
 >([]);

 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  if (!open || !vehicleId) {
   return;
  }

  const fetchMovimientos = async () => {
   setLoading(true);
   setError(null);

   try {
    const response = await odooApi.get(
     `/movimientos-internos/vehicle_id/${vehicleId} `
    );

    setMovimientos(response.data ?? []);
   } catch (err) {
    console.error(
     "Error obteniendo movimientos internos:",
     err
    );

    setError(
     "No fue posible obtener el historial de movimientos."
    );

    setMovimientos([]);
   } finally {
    setLoading(false);
   }
  };

  fetchMovimientos();
 }, [open, vehicleId]);

 const vehicleName =
  movimientos.length > 0
   ? movimientos[0].vehicle
   : null;

 return (
  <>
   {/* HEADER */}
   < Box
    sx={{
     px: 2.5,
     py: 1.8,
     backgroundColor: "#FFFFFF",
     borderBottom: "1px solid #E2E8F0",
    }}
   >
    <Stack
     direction="row"
     alignItems="center"
     justifyContent="space-between"
     spacing={2}
    >
     <Stack
      direction="row"
      alignItems="center"
      spacing={1.4}
     >
      <Box
       sx={{
        width: 40,
        height: 40,
        borderRadius: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EFF6FF",
        color: "#2563EB",
       }}
      >
       <HistoryIcon />
      </Box>

      <Box>
       <Typography
        sx={{
         fontSize: 17,
         fontWeight: 700,
         color: "#0F172A",
         lineHeight: 1.2,
         fontFamily: "Inter, sans-serif",
        }}
       >
        Movimientos internos
       </Typography>

       <Stack
        direction="row"
        alignItems="center"
        spacing={0.7}
        sx={{
         mt: 0.4, fontFamily: "Inter, sans-serif",
        }}
       >
        <DirectionsCarOutlinedIcon
         sx={{
          fontSize: 14,
          color: "#64748B",
         }}
        />

        <Typography
         sx={{
          fontSize: 11,
          color: "#64748B",
          fontFamily: "Inter, sans-serif",
         }}
        >
         {vehicleName ??
          "Historial del vehículo"}
        </Typography>
       </Stack>
      </Box>
     </Stack>
    </Stack>
   </Box >

   <DialogContent
    sx={{
     p: 0,
     backgroundColor: "#F8FAFC",
    }}
   >
    {/* SUMMARY */}
    {!loading &&
     !error &&
     movimientos.length > 0 && (
      <Box
       sx={{
        px: 2.5,
        py: 1.2,
        backgroundColor: "#FFFFFF",
        borderBottom:
         "1px solid #E2E8F0",
       }}
      >
       <Stack
        direction="row"
        alignItems="center"
        spacing={1}
       >
        <TripOriginOutlinedIcon
         sx={{
          fontSize: 16,
          color: "#2563EB",
         }}
        />

        <Typography
         sx={{
          fontSize: 12,
          fontWeight: 600,
          color: "#475569",
          fontFamily: "Inter, sans-serif",
         }}
        >
         Historial de actividad
        </Typography>

        <Chip
         label={`${movimientos.length} ${movimientos.length ===
          1
          ? "registro"
          : "registros"
          } `}
         size="small"
         sx={{
          fontFamily: "Inter, sans-serif",
          height: 23,
          fontSize: 10,
          fontWeight: 700,
          backgroundColor:
           "#F1F5F9",
          color: "#475569",
         }}
        />
       </Stack>
      </Box>
     )}

    {/* CONTENT */}
    <Box
     sx={{
      px: { xs: 1.5, sm: 2.5 },
      py: 2,
      maxHeight: "68vh",
      overflowY: "auto",
     }}
    >
     {/* LOADING */}
     {loading && (
      <Box
       sx={{
        minHeight: 280,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
       }}
      >
       <Stack
        alignItems="center"
        spacing={1.2}
       >
        <CircularProgress
         size={28}
         thickness={4}
        />

        <Typography
         sx={{
          fontSize: 12,
          color: "#64748B",
          fontFamily: "Inter, sans-serif",
         }}
        >
         Cargando movimientos...
        </Typography>
       </Stack>
      </Box>
     )}

     {/* ERROR */}
     {!loading && error && (
      <Box
       sx={{
        py: 8,
        textAlign: "center",
       }}
      >
       <Typography
        sx={{
         fontSize: 13,
         fontWeight: 600,
         color: "#DC2626",
         fontFamily: "Inter, sans-serif",
        }}
       >
        {error}
       </Typography>
      </Box>
     )}

     {/* EMPTY */}
     {!loading &&
      !error &&
      movimientos.length === 0 && (
       <Box
        sx={{
         py: 8,
         textAlign: "center",
        }}
       >
        <Box
         sx={{
          width: 48,
          height: 48,
          mx: "auto",
          mb: 1.5,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
           "#F1F5F9",
          color: "#64748B",
         }}
        >
         <HistoryIcon />
        </Box>

        <Typography
         sx={{
          fontSize: 14,
          fontWeight: 700,
          color: "#334155",
          fontFamily: "Inter, sans-serif",
         }}
        >
         Sin movimientos registrados
        </Typography>

        <Typography
         sx={{
          mt: 0.5,
          fontSize: 12,
          color: "#94A3B8",
          fontFamily: "Inter, sans-serif",
         }}
        >
         No existen movimientos internos
         para este vehículo.
        </Typography>
       </Box>
      )}

     {/* LIST */}
     {!loading &&
      !error &&
      movimientos.map((movimiento) => {
       const typeStyle =
        getTypeStyle(
         movimiento.type
        );

       return (
        <Box
         key={movimiento.id}
         sx={{
          mb: 1.2,
          backgroundColor:
           "#FFFFFF",
          border:
           "1px solid #E2E8F0",
          borderRadius: 2,
          overflow: "hidden",
          transition:
           "border-color 0.15s ease, box-shadow 0.15s ease",
          "&:hover": {
           borderColor:
            "#CBD5E1",
           boxShadow:
            "0 4px 15px rgba(15,23,42,0.05)",
          },
         }}
        >
         {/* TOP */}
         <Box
          sx={{
           px: 2,
           py: 1.35,
           display: "flex",
           alignItems:
            "center",
           justifyContent:
            "space-between",
           gap: 2,
           borderBottom:
            "1px solid #F1F5F9",
          }}
         >
          <Stack
           direction="row"
           alignItems="center"
           spacing={1.2}
           minWidth={0}
          >
           <Box
            sx={{
             width: 34,
             height: 34,
             borderRadius: 1.2,
             display:
              "flex",
             alignItems:
              "center",
             justifyContent:
              "center",
             backgroundColor:
              typeStyle.background,
             color:
              typeStyle.color,
             flexShrink: 0,
            }}
           >
            <LocalShippingOutlinedIcon
             sx={{
              fontSize: 18,
             }}
            />
           </Box>

           <Box minWidth={0}>
            <Typography
             sx={{
              fontSize: 16,
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              color: "#0F172A",
              overflow:
               "hidden",
              textOverflow:
               "ellipsis",
              whiteSpace:
               "nowrap",
             }}
            >
             {movimiento.type ||
              "Movimiento"}
            </Typography>

            <Stack
             direction="row"
             alignItems="center"
             spacing={
              0.6
             }
             sx={{
              mt: 0.25,
             }}
            >
             <PersonOutlineOutlinedIcon
              sx={{
               fontSize: 12,
               color: "#94A3B8",
              }}
             />

             <Typography
              sx={{
               fontFamily: "Inter, sans-serif",
               fontSize: 12,
               color: "#64748B",
               overflow:
                "hidden",
               textOverflow:
                "ellipsis",
               whiteSpace:
                "nowrap",
              }}
             >
              {movimiento.driver ??
               "Sin operador"}
             </Typography>
            </Stack>
           </Box>
          </Stack>

          <Stack
           direction="row"
           alignItems="center"
           spacing={1}
           flexShrink={0}
          >
           <Chip
            label={formatDate(
             movimiento.date
            )}
            icon={
             <CalendarTodayOutlinedIcon />
            }
            size="small"
            sx={{
             fontFamily: "Inter, sans-serif",
             height: 25,
             fontSize: 10.5,
             fontWeight: 700,
             backgroundColor:
              typeStyle.background,
             color:
              typeStyle.color,
             border: `1px solid ${typeStyle.border} `,
             "& .MuiChip-icon":
             {
              fontSize: 13,
              color:
               typeStyle.color,
             },
            }}
           />

           <Typography
            sx={{
             fontFamily: "Inter, sans-serif",
             fontSize: 10,
             color: "#94A3B8",
            }}
           >
            #{movimiento.id}
           </Typography>
          </Stack>
         </Box>

         {/* EQUIPMENT */}
         <Box
          sx={{
           px: 2,
           py: 1.3,
           backgroundColor:
            "#F8FAFC",
          }}
         >
          <Stack
           direction="row"
           alignItems="center"
           spacing={0.7}
           sx={{ mb: 1 }}
          >
           <LocalShippingOutlinedIcon
            sx={{
             fontSize: 15,
             color: "#64748B",
            }}
           />

           <Typography
            sx={{
             fontFamily: "Inter, sans-serif",
             fontSize: 10,
             fontWeight: 700,
             color: "#64748B",
             textTransform:
              "uppercase",
             letterSpacing:
              0.5,
            }}
           >
            Equipo utilizado
           </Typography>
          </Stack>

          <Stack
           direction="row"
           flexWrap="wrap"
           gap={0.8}
          >
           <EquipmentBadge
            label="Tracto"
            value={
             movimiento.vehicle
            }
           />

           <EquipmentBadge
            label="Remolque 1"
            value={
             movimiento.trailer1_name
            }
           />

           <EquipmentBadge
            label="Remolque 2"
            value={
             movimiento.trailer2_name
            }
           />

           <EquipmentBadge
            label="Dolly"
            value={
             movimiento.dolly_name
            }
           />
          </Stack>
         </Box>

         {/* COMMENTS */}
         {movimiento.comentarios && (
          <Box
           sx={{
            px: 2,
            py: 1.1,
            display: "flex",
            alignItems:
             "flex-start",
            gap: 0.8,
            borderTop:
             "1px solid #F1F5F9",
           }}
          >
           <NotesOutlinedIcon
            sx={{
             fontSize: 15,
             color: "#94A3B8",
             mt: 0.15,
            }}
           />

           <Typography
            sx={{
             fontFamily: "Inter, sans-serif",
             fontSize: 11,
             color: "#64748B",
             lineHeight: 1.5,
            }}
           >
            {
             movimiento.comentarios
            }
           </Typography>
          </Box>
         )}

         {/* FOOTER */}
         <Box
          sx={{
           px: 2,
           py: 0.8,
           display: "flex",
           justifyContent:
            "flex-end",
           alignItems:
            "center",
           gap: 0.5,
           borderTop:
            "1px solid #F1F5F9",
          }}
         >
          <AccessTimeOutlinedIcon
           sx={{
            fontSize: 12,
            color: "#CBD5E1",
           }}
          />

          <Typography
           sx={{
            fontFamily: "Inter, sans-serif",
            fontSize: 9.5,
            color: "#94A3B8",
           }}
          >
           Registrado{" "}
           {formatDateTime(
            movimiento.created_at
           )}
          </Typography>
         </Box>
        </Box>
       );
      })}
    </Box>
   </DialogContent>
  </>
 );
}