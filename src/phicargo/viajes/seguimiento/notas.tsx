import { Drawer, Box, DialogContent, DialogTitle, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TextareaInput } from "@/components/inputs";
import {
  Button,
  Card,
  CardHeader,
  Progress,
  User,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import odooApi from "@/api/odoo-api";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

type NoteForm = {
  origen_id: number;
  model: string;
  note: string;
  usuario_creacion?: string;
  created_date?: string;
};

interface Props {
  origen_id: number;
  model: string;
  open: boolean;
  onClose: () => void;
}

export default function Notas({
  open,
  onClose,
  origen_id,
  model
}: Props) {
  const initial: NoteForm = {
    origen_id: origen_id,
    model: model,
    note: "",
  };

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<NoteForm>({
    defaultValues: initial,
  });

  const [isLoadingCreate, setLoadingCreate] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [data, setData] = useState<NoteForm[]>([]);

  const formatDate = (date?: string) => {
    if (!date) return "";

    try {
      const formattedDate = new Date(date);

      return formattedDate.toLocaleString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return date;
    }
  };

  /**
   * Obtiene las notas del viaje.
   */
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await odooApi.get(
        `/notes/model/?origen_id=${origen_id}&model=${model}`
      );

      setData(res.data);

      // Limpiamos el formulario
      reset({
        origen_id: origen_id,
        note: "",
        model: model
      });
    } catch (error: any) {
      const detail =
        error.response?.data?.detail || error.message;

      toast.error("Error: " + detail);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Guarda una nueva nota.
   */
  const SaveForm = async (formData: NoteForm) => {
    try {
      setLoadingCreate(true);

      const url = "/notes/";

      const res = await odooApi.post(url, formData);

      if (res.data.status === "success") {
        toast.success(res.data.message);

        // Recargamos las notas
        await fetchData();
      }
    } catch (error: any) {
      const detail =
        error.response?.data?.detail || error.message;

      toast.error("Error: " + detail);
    } finally {
      setLoadingCreate(false);
    }
  };

  useEffect(() => {
    if (open && origen_id) {
      fetchData();
    }
  }, [open, origen_id]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 2,
      }}
    >
      <Box
        sx={{
          width: {
            xs: "100vw",
            sm: 600,
          },
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <DialogTitle
          sx={{
            background:
              "linear-gradient(90deg, #002887 0%, #0059b3 100%)",
            color: "white",
            fontFamily: "Inter",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px",
          }}
        >
          <span>Notas internas</span>

          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.15)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* CONTENIDO */}
        <DialogContent
          sx={{
            padding: "20px !important",
            overflowY: "auto",
          }}
        >
          {/* ========================= */}
          {/* AGREGAR NOTA */}
          {/* ========================= */}

          <div className="mb-5">
            <h3 className="text-base font-semibold text-gray-800">
              Agregar nota
            </h3>

            <p className="text-sm text-gray-500 mt-1 mb-4">
              Registra información importante relacionada con este
              viaje.
            </p>

            <form
              onSubmit={handleSubmit(SaveForm)}
              className="space-y-3"
            >
              <TextareaInput
                control={control}
                label="Nota"
                name="note"
                rules={{
                  required: "Escribe una nota",
                }}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  color="primary"
                  radius="md"
                  size="sm"
                  isLoading={isLoadingCreate}
                >
                  Guardar nota
                </Button>
              </div>
            </form>
          </div>

          {/* SEPARADOR */}

          <Divider />

          {/* ========================= */}
          {/* HISTORIAL */}
          {/* ========================= */}

          <div className="mt-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-gray-800">
                  Historial de notas
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {data.length === 0
                    ? "No hay notas registradas"
                    : `${data.length} ${data.length === 1
                      ? "nota registrada"
                      : "notas registradas"
                    }`}
                </p>
              </div>
            </div>

            {/* LOADING */}

            {isLoading && (
              <div className="mb-4">
                <Progress
                  size="sm"
                  isIndeterminate
                  color="primary"
                />
              </div>
            )}

            {/* SIN NOTAS */}

            {!isLoading && data.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <span className="text-xl">📝</span>
                </div>

                <p className="text-sm font-medium text-gray-700">
                  No hay notas todavía
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  La primera nota aparecerá aquí.
                </p>
              </div>
            )}

            {/* NOTAS */}

            {!isLoading && data.length > 0 && (
              <div className="space-y-3">
                {data.map((item, index) => (
                  <Card
                    key={`${item.origen_id}-${item.created_date}-${index}`}
                    className="border border-gray-100 shadow-sm"
                  >
                    <CardHeader className="px-4 py-4 flex-col items-start">
                      {/* USUARIO */}

                      <User
                        avatarProps={{
                          size: "md",
                          color: "primary"
                        }}
                        name={
                          <span className="text-sm font-semibold text-gray-800">
                            {item.usuario_creacion ||
                              "Usuario"}
                          </span>
                        }
                        description={
                          <span className="text-xs text-gray-400">
                            {formatDate(item.created_date)}
                          </span>
                        }
                      />

                      {/* NOTA */}

                      <div className="w-full mt-4">
                        <p className="text-sm text-gray-700 leading-6 whitespace-pre-wrap">
                          {item.note}
                        </p>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Box>
    </Drawer>
  );
}