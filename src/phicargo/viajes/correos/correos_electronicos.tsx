import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Card,
  CardHeader,
  Progress,
  Button,
  Input,
} from "@heroui/react";
import React, { useContext, useEffect, useState } from "react";
import FormularioCorreoGeneral from "@/phicargo/correos_electronicos/form";
import { ViajeContext } from "../context/viajeContext";
import odooApi from "@/api/odoo-api";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

export type CorreoCliente = {
  id_correo: number;
  nombre_completo: string;
  id_cliente: number | null;
  correo: string;
  tipo: string;
  activo: boolean;
};

type CorreoLigado = {
  id: number;
  id_correo: number;
  correo: string;
  tipo: string;
  nombre_completo: string;
};

type CorreosElectronicosViajeProps = {
  openCorreos: boolean;
  handleCloseCorreos: () => void;
};

const CorreosElectronicosViaje: React.FC<
  CorreosElectronicosViajeProps
> = ({ openCorreos, handleCloseCorreos }) => {
  const { id_viaje, viaje, comprobacion_correos } =
    useContext(ViajeContext);

  const [correosCliente, setCorreosCliente] = useState<CorreoCliente[]>([]);
  const [correosLigados, setCorreosLigados] = useState<CorreoLigado[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingCM, setLoadingCM] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const getCorreosCliente = async () => {
    if (!viaje?.partner?.id) return;

    try {
      setLoading(true);

      const response = await odooApi.get(
        "/correos/id_cliente/" + viaje.partner.id
      );

      setCorreosCliente(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCorreosLigados = async () => {
    if (!id_viaje) return;

    try {
      setLoading(true);

      const response = await odooApi.get(
        "/tms_travel/correos/id_viaje/" + id_viaje
      );

      setCorreosLigados(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const enlazarCorreo = async (id_correo: number) => {
    try {
      setLoading(true);

      const response = await odooApi.get(`/tms_travel/correos/enlazar/`, {
        params: {
          id_viaje: id_viaje as number,
          id_correo,
        },
      });

      if (response.data.status === "success") {
        toast.success(response.data.message);
        await getCorreosLigados();
        comprobacion_correos();
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail || "Error desconocido"
      );
    } finally {
      setLoading(false);
    }
  };

  const enlazarCorreoManiobras = async () => {
    try {
      setLoadingCM(true);

      await odooApi.get(
        `/maniobras/correos/ligar_correos_maniobra/${id_viaje}`
      );

      await getCorreosLigados();
      comprobacion_correos();

      toast.success("Correos de maniobras ligados correctamente.");
    } catch (error) {
      toast.error("Error al ligar los correos de maniobras.");
      console.error(error);
    } finally {
      setLoadingCM(false);
    }
  };

  const desvincularCorreo = async (id: number) => {
    try {
      setLoading(true);

      const response = await odooApi.delete(
        "/tms_travel/correos/desvincular/" + id
      );

      if (response.data.status === "success") {
        toast.success(response.data.message);
      }

      await getCorreosLigados();
      comprobacion_correos();
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail ||
        "Error al desvincular el correo."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!openCorreos) return;

    getCorreosCliente();
    getCorreosLigados();
  }, [openCorreos, id_viaje, viaje?.partner?.id]);

  const filteredData = correosLigados.filter(
    (correo) =>
      correo.correo
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      correo.tipo
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      correo.nombre_completo
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    getCorreosCliente();
    getCorreosLigados();
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={openCorreos}
        onClose={handleCloseCorreos}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
            backgroundColor: "#f8fafc",
          },
        }}
      >
        {/* HEADER */}
        <DialogTitle
          sx={{
            backgroundColor: "#ffffff",
            color: "#1e293b",
            borderBottom: "1px solid #e2e8f0",
            padding: "18px 24px",
            fontFamily: "Inter",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#002887] text-white">
              <i className="bi bi-envelope-fill text-lg" />
            </div>

            <div className="flex flex-col">
              <span className="text-[17px] font-bold text-slate-800">
                Correos electrónicos
              </span>

              <span className="text-xs font-normal text-slate-500">
                Administración de destinatarios asociados al viaje
              </span>
            </div>
          </div>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            borderColor: "#e2e8f0",
            backgroundColor: "#f8fafc",
            padding: "20px",
          }}
        >
          <div className="space-y-5">

            {/* ACCIONES */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    Acciones
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Administra los correos relacionados con las maniobras
                    del viaje.
                  </p>
                </div>

                <Button
                  color="primary"
                  variant="flat"
                  radius="md"
                  size="sm"
                  onPress={enlazarCorreoManiobras}
                  isLoading={isLoadingCM}
                  startContent={
                    !isLoadingCM && (
                      <i className="bi bi-link-45deg text-base" />
                    )
                  }
                >
                  Ligar correos de maniobras
                </Button>
              </div>

              {isLoading && (
                <Progress
                  isIndeterminate
                  size="sm"
                  color="primary"
                  className="rounded-none"
                />
              )}
            </div>

            {/* CORREOS DEL CLIENTE */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#002887]">
                    <i className="bi bi-person-vcard-fill" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Correos del cliente
                    </h3>

                    <p className="text-xs text-slate-500">
                      Selecciona un correo para asociarlo al viaje.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <Autocomplete
                  fullWidth
                  defaultItems={correosCliente}
                  variant="bordered"
                  label="Correo electrónico"
                  placeholder="Selecciona un correo electrónico"
                  labelPlacement="inside"
                  classNames={{
                    base: "w-full",
                    popoverContent: "p-1",
                  }}
                  listboxProps={{
                    hideSelectedIcon: true,
                    itemClasses: {
                      base: [
                        "rounded-lg",
                        "text-default-500",
                        "transition-opacity",
                        "data-[hover=true]:text-foreground",
                        "data-[hover=true]:bg-default-100",
                        "data-[pressed=true]:opacity-70",
                        "data-[selectable=true]:focus:bg-default-100",
                        "data-[focus-visible=true]:ring-default-500",
                      ],
                    },
                  }}
                >
                  {(correo) => (
                    <AutocompleteItem
                      key={correo.id_correo}
                      textValue={correo.correo}
                    >
                      <div className="flex items-center justify-between gap-4 py-1">
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar
                            alt={correo.correo}
                            size="sm"
                            color="primary"
                            className="shrink-0"
                          />

                          <div className="flex min-w-0 flex-col">
                            <span className="truncate text-sm font-medium text-slate-700">
                              {correo.correo}
                            </span>

                            <span className="text-xs text-slate-400">
                              {correo.tipo}
                            </span>
                          </div>
                        </div>

                        <Button
                          color="primary"
                          variant="flat"
                          size="sm"
                          radius="md"
                          onPress={() =>
                            enlazarCorreo(correo.id_correo)
                          }
                          startContent={
                            <i className="bi bi-link-45deg" />
                          }
                        >
                          Ligar
                        </Button>
                      </div>
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
            </div>

            {/* CORREOS LIGADOS */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <i className="bi bi-envelope-check-fill" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        Correos ligados
                      </h3>

                      <p className="text-xs text-slate-500">
                        Destinatarios actualmente asociados al viaje.
                      </p>
                    </div>
                  </div>

                  <Button
                    color="primary"
                    radius="md"
                    size="sm"
                    onPress={handleClickOpen}
                    startContent={
                      <i className="bi bi-plus-lg" />
                    }
                  >
                    Nuevo correo electrónico
                  </Button>
                </div>
              </div>

              <div className="p-5">
                {/* BUSCADOR */}
                <Input
                  isClearable
                  variant="bordered"
                  size="sm"
                  placeholder="Buscar por correo, nombre o tipo..."
                  value={searchTerm}
                  onClear={() => setSearchTerm("")}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startContent={
                    <i className="bi bi-search text-slate-400" />
                  }
                  classNames={{
                    inputWrapper:
                      "border-slate-200 bg-white shadow-none hover:border-slate-300",
                  }}
                />

                {/* LISTADO */}
                <div className="mt-4 space-y-3">
                  {filteredData.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <i className="bi bi-envelope-x text-lg" />
                      </div>

                      <p className="mt-3 text-sm font-medium text-slate-600">
                        No hay correos ligados
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Los correos asociados al viaje aparecerán aquí.
                      </p>
                    </div>
                  ) : (
                    filteredData.map((correo) => (
                      <Card
                        key={correo.id}
                        shadow="none"
                        className="border border-slate-200 bg-white"
                      >
                        <CardHeader className="justify-between gap-4 px-4 py-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <Avatar
                              isBordered
                              radius="lg"
                              size="md"
                              color="primary"
                            />

                            <div className="flex min-w-0 flex-col gap-1">
                              <span className="truncate text-sm font-semibold text-slate-700">
                                {correo.nombre_completo}
                              </span>

                              <span className="truncate text-xs text-slate-500">
                                {correo.correo}
                              </span>

                              <span className="w-fit rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                                {correo.tipo}
                              </span>
                            </div>
                          </div>

                          <Button
                            color="danger"
                            variant="flat"
                            radius="md"
                            size="sm"
                            onPress={() =>
                              desvincularCorreo(correo.id)
                            }
                            startContent={
                              <i className="bi bi-x-circle" />
                            }
                          >
                            Desvincular
                          </Button>
                        </CardHeader>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>

        {/* FOOTER */}
        <DialogActions
          sx={{
            backgroundColor: "#ffffff",
            borderTop: "1px solid #e2e8f0",
            padding: "12px 20px",
          }}
        >
          <Button
            onPress={handleCloseCorreos}
            color="default"
            variant="flat"
            radius="md"
            size="sm"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <FormularioCorreoGeneral
        open={open}
        handleClose={handleClose}
        id_cliente={viaje?.partner?.id}
      />
    </>
  );
};

export default CorreosElectronicosViaje;