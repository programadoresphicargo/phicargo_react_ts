
import { Button, Select, SelectItem } from "@heroui/react";
import { useContext, useState } from "react";
import { Upload } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { ViajeContext } from "../context/viajeContext";
import odooApi from "@/api/odoo-api";
import toast from "react-hot-toast";

const { Dragger } = Upload;

type Props = {
  onClose: () => void;
};

const FormularioDocumentacion = ({ onClose }: Props) => {
  const { id_viaje } = useContext(ViajeContext);

  const [tipo_archivo, setSelectedValue] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  const props: UploadProps = {
    name: "file",
    multiple: true,
    fileList,
    showUploadList: {
      showRemoveIcon: true,
    },
    onChange(info) {
      setFileList(info.fileList);
    },
    beforeUpload: (file) => {
      setFileList((prev) => [...prev, file]);
      return false;
    },
    onRemove: (file) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
  };

  const enviar_documentacion = async () => {
    if (!id_viaje) {
      toast.error("No hay viaje seleccionado");
      return;
    }

    if (!tipo_archivo) {
      toast.error("Selecciona el tipo de documento");
      return;
    }

    if (fileList.length === 0) {
      toast.error("Selecciona al menos un archivo");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("id_viaje", String(id_viaje));
    data.append("tipo_archivo", tipo_archivo);

    fileList.forEach((file) => {
      if (file.originFileObj instanceof File) {
        data.append("files", file.originFileObj);
      }
    });

    try {
      const response = await odooApi.post(
        "/tms_travel/enviar_documentacion/",
        data
      );

      if (response.data.status === "success") {
        toast.success(response.data.message);
        setFileList([]);
        setSelectedValue("");
        onClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail ||
        "Error en la solicitud de subida"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 font-[Inter]">

      {/* Encabezado */}
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <i className="bi bi-folder2-open text-xl"></i>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold text-default-900">
            Documentación del viaje
          </h3>
          <p className="text-sm text-default-500">
            Adjunta los documentos correspondientes a este viaje.
          </p>
        </div>
      </div>

      {/* Tipo de documento */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-default-700">
          Tipo de documento
        </span>

        <Select
          variant="bordered"
          size="lg"
          placeholder="Selecciona una categoría"
          selectedKeys={tipo_archivo ? [tipo_archivo] : []}
          onChange={(e) => setSelectedValue(e.target.value)}
          classNames={{
            trigger: "border-default-200",
            value: "text-sm",
          }}
        >
          <SelectItem key="pod">
            POD
          </SelectItem>
          <SelectItem key="eir">
            EIR
          </SelectItem>
          <SelectItem key="cuenta_op">
            Cuenta de operador
          </SelectItem>
        </Select>
      </div>

      {/* Archivos */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-default-700">
            Archivos adjuntos
          </span>

          <span className="text-xs text-default-400">
            {fileList.length} archivo(s) seleccionado(s)
          </span>
        </div>

        <Dragger
          {...props}
          style={{
            fontFamily: "Inter",
            background: "transparent",
            borderRadius: 12,
            border: "1.5px dashed #A1A1AA",
            padding: "20px 12px",
          }}
        >
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <i className="bi bi-cloud-arrow-up text-3xl"></i>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-default-800">
                Arrastra tus archivos aquí
              </p>

              <p className="text-xs text-default-500">
                o haz clic para seleccionar desde tu equipo
              </p>
            </div>

            <span className="rounded-lg bg-default-100 px-3 py-1.5 text-xs font-medium text-default-600">
              Seleccionar archivos
            </span>
          </div>
        </Dragger>

        <p className="text-xs text-default-400">
          Puedes seleccionar múltiples archivos para una misma categoría.
        </p>
      </div>

      {/* Acción */}
      <div className="flex items-center justify-between gap-3 border-t border-default-200 pt-4">
        <span className="text-xs text-default-400">
          {fileList.length > 0
            ? "Documentos listos para enviar"
            : "No hay archivos seleccionados"}
        </span>

        <Button
          color="primary"
          radius="md"
          size="sm"
          isLoading={loading}
          isDisabled={fileList.length === 0 || !tipo_archivo}
          onPress={enviar_documentacion}
          startContent={
            !loading && <i className="bi bi-cloud-arrow-up"></i>
          }
          className="font-medium px-6"
        >
          Enviar documentación
        </Button>
      </div>
    </div>
  );
};

export default FormularioDocumentacion;
