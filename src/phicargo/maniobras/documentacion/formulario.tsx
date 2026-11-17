import { Button } from "@heroui/react";
import { useState } from 'react';
import { Select, SelectItem } from "@heroui/react";
import { Upload, UploadFile, UploadProps, message } from 'antd';
import { useAuthContext } from "@/modules/auth/hooks";

const { Dragger } = Upload;
const { VITE_PHIDES_API_URL } = import.meta.env;

const FormularioDocumentacionManiobra = ({ onClose, id_maniobra }: { onClose: () => void, id_maniobra: number }) => {

  const { session } = useAuthContext();
  const [tipo_doc, setSelectedValue] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [Loading, setLoading] = useState(false);

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    beforeUpload: (file) => {
      setFileList((prevFileList) => [...prevFileList, file]);
      return false;
    },
    fileList,
    onRemove: (file) => {
      setFileList((prevFileList) => prevFileList.filter((f) => f.uid !== file.uid));
    },
  };

  const handleUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('id_maniobra', String(id_maniobra));
    formData.append('tipo_doc', tipo_doc);
    formData.append('id_usuario', String(session?.user.id));
    fileList.forEach((file) => {
      if (file.originFileObj) {
        formData.append(
          'files[]',
          file.originFileObj,
          file.name
        );
      }
    });

    try {
      const response = await fetch(VITE_PHIDES_API_URL + '/modulo_maniobras/documentacion/enviarDocumentos.php', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setLoading(false);
      if (data.status == "success") {
        message.success(data.message);
        setFileList([]);
        onClose();
      } else {
        message.error(`Error: ${data.message}`);
      }
    } catch (error) {
      setLoading(false);
      message.error('Error en la solicitud de subida');
    }
  };

  return (
    <>

      <Button
        isLoading={Loading}
        color="primary"
        onPress={handleUpload}
        style={{ marginTop: 16 }}
        isDisabled={fileList.length === 0 || tipo_doc === ''}
      >
        Subir Archivos
      </Button>

      <Select
        variant="bordered"
        size="lg"
        label="Seleccionar tipo de documento"
        className="w-full sm:max-w-[100%] mb-4 mt-4"
        fullWidth={true}
        onChange={(e) => setSelectedValue(e.target.value)} // Actualiza directamente
      >
        <SelectItem key="eir">EIR</SelectItem>
      </Select>

      <Dragger {...props} style={{ fontFamily: 'Inter' }}>
        <p className="ant-upload-drag-icon">
          {/* <InboxOutlined /> */}
        </p>
        <p className="ant-upload-text">Haz clic o arrastra el archivo aquí para subirlo</p>
        <p className="ant-upload-hint">Soporta múltiples archivos</p>
      </Dragger>
    </>
  );
};

export default FormularioDocumentacionManiobra;
