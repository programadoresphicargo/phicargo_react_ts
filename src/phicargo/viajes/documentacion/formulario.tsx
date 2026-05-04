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
  const [loading, setLoading] = useState<boolean>(false);

  const props: UploadProps = {
    name: "file",
    multiple: true,
    fileList,

    onChange(info) {
      setFileList(info.fileList);
    },

    beforeUpload: (file) => {
      setFileList((prev) => [...prev, file]);
      return false; // evita subida automática
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

    setLoading(true);

    const data = new FormData();
    data.append("id_viaje", String(id_viaje));
    data.append("tipo_archivo", tipo_archivo);

    fileList.forEach((fileWrapper) => {
      if (fileWrapper.originFileObj instanceof File) {
        data.append("files", fileWrapper.originFileObj);
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
        onClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error en la solicitud de subida");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        radius="full"
        isLoading={loading}
        color="primary"
        onPress={enviar_documentacion}
        style={{ marginTop: 16 }}
        isDisabled={fileList.length === 0 || !tipo_archivo}
      >
        Subir Archivos
      </Button>

      <Select
        variant="bordered"
        size="lg"
        label="Seleccionar tipo de documento"
        className="w-full sm:max-w-[100%] mb-4 mt-4"
        onChange={(e) => setSelectedValue(e.target.value)}
      >
        <SelectItem key="POD">
          POD
        </SelectItem>
        <SelectItem key="EIR">
          EIR
        </SelectItem>
        <SelectItem key="CUENTA_OP">
          Cuenta de operador
        </SelectItem>
      </Select>

      <Dragger {...props} style={{ fontFamily: "Inter" }}>
        <p className="ant-upload-text">
          Haz clic o arrastra el archivo aquí para subirlo
        </p>
        <p className="ant-upload-hint">Soporta múltiples archivos</p>
      </Dragger>
    </>
  );
};

export default FormularioDocumentacion;