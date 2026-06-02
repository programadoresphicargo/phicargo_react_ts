import { Button, } from "@heroui/react";
import { useState } from 'react';
import { Upload, UploadFile, UploadProps } from 'antd';
import odooApi from "@/api/odoo-api";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import toast from 'react-hot-toast';
import Archivos from "./archivos";

const { Dragger } = Upload;

const FormularioArchivos = ({ open, onClose, ruta, tabla, id }: { open: boolean, onClose: () => void, ruta: string; tabla: string, id: number }) => {

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [Loading, setLoading] = useState(false);

    const props: UploadProps = {
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

    const enviarArchivo = async () => {
        setLoading(true);
        const data = new FormData();
        data.append('ruta', ruta + id);
        data.append('tabla', tabla);
        data.append('id', String(id));
        fileList.forEach((fileWrapper) => {
            if (fileWrapper.originFileObj instanceof File) {
                data.append('files', fileWrapper.originFileObj);
            }
        });

        try {
            const response = await odooApi.post('/archivos/guardar/', data);
            setLoading(false);
            if (response.data.status == "success") {
                toast.success(response.data.message);
                setFileList([]);
                onClose();
            } else {
                toast.error(response.data.message);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error('Error en la solicitud de subida');
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
                <DialogTitle>Archivos adjuntos</DialogTitle>

                <DialogContent>
                    <div className="mb-2">
                        <Button
                            isLoading={Loading}
                            color="primary"
                            radius="full"
                            onPress={enviarArchivo}
                            style={{ marginTop: 16 }}
                            isDisabled={fileList.length === 0}
                        >
                            Subir Archivos
                        </Button>
                    </div>
                    <Dragger {...props} style={{ fontFamily: 'Inter' }}>
                        <p className="ant-upload-drag-icon">
                        </p>
                        <p className="ant-upload-text">Haz clic o arrastra el archivo aquí para subirlo</p>
                        <p className="ant-upload-hint">Soporta múltiples archivos</p>
                    </Dragger>

                    <Archivos id={id}></Archivos>
                </DialogContent>

                <DialogActions>
                    <Button onPress={onClose} color="default">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default FormularioArchivos;
