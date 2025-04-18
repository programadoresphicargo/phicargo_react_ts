import { Button, select } from "@heroui/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Select, SelectItem } from "@heroui/react";
// import { InboxOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';

import { Box } from '@mui/material';
import Slide from '@mui/material/Slide';
import { ViajeContext } from '../context/viajeContext';
import { useAuthContext } from "@/modules/auth/hooks";

const { Dragger } = Upload;
const { VITE_PHIDES_API_URL } = import.meta.env;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FormularioDocumentacion = ({ onClose }) => {

  const { session } = useAuthContext();
  const { id_viaje, viaje, getViaje, loading, error, setIDViaje, isLoading } = useContext(ViajeContext);
  const [tipo_doc, setSelectedValue] = useState('');
  const [fileList, setFileList] = useState([]);

  const [Loading, setLoading] = useState(false);

  const props = {
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
    formData.append('id_viaje', id_viaje);
    formData.append('tipo_doc', tipo_doc);
    formData.append('id_usuario', session.user.id);
    fileList.forEach((file) => {
      formData.append('files[]', file);
    });

    try {
      const response = await fetch(VITE_PHIDES_API_URL + '/viajes/documentacion/enviarDocumentos.php', {
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
        onClick={handleUpload}
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
        <SelectItem key="pod" value="POD">POD</SelectItem>
        <SelectItem key="eir" value="EIR">EIR</SelectItem>
        <SelectItem key="cuentaop" value="Cuenta de operador">Cuenta de operador</SelectItem>
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

export default FormularioDocumentacion;
