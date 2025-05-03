import { Button, select } from "@heroui/react";
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Select, SelectItem } from "@heroui/react";
import { Upload, message } from 'antd';
import { Box } from '@mui/material';
import Slide from '@mui/material/Slide';
import { ViajeContext } from '../context/viajeContext';
import { useAuthContext } from "@/modules/auth/hooks";
import odooApi from "@/api/odoo-api";

const { Dragger } = Upload;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FormularioDocumentacion = ({ onClose }) => {

  const { session } = useAuthContext();
  const { id_viaje, viaje, getViaje, loading, error, setIDViaje, isLoading } = useContext(ViajeContext);
  const [tipo_archivo, setSelectedValue] = useState('');
  const [fileList, setFileList] = useState([]);

  const [Loading, setLoading] = useState(false);

  const props = {
    name: 'file',
    multiple: true,
    onChange(info) {
      setFileList(info.fileList);
    },
    beforeUpload: (file) => {
      setFileList((prevFileList) => [...prevFileList, file]);
      return false;
    },
    fileList,
    onRemove: (file) => {
      setFileList((prevFileList) => prevFileList.filter((f) => f.uid !== file.uid));
    },
  };

  const enviar_documentacion = async () => {
    setLoading(true);
    const data = new FormData();
    data.append('id_viaje', id_viaje);
    data.append('tipo_archivo', tipo_archivo);

    fileList.forEach((fileWrapper) => {
      if (fileWrapper.originFileObj instanceof File) {
        data.append('files', fileWrapper.originFileObj);
      }
    });

    try {
      const response = await odooApi.post('/tms_travel/enviar_documentacion/', data);
      setLoading(false);
      if (response.data.status == "success") {
        message.success(response.data.message);
        setFileList([]);
        onClose();
      } else {
        message.error(`Error: ${response.data.message}`);
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
        onPress={enviar_documentacion}
        style={{ marginTop: 16 }}
        isDisabled={fileList.length === 0 || tipo_archivo === ''}
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
