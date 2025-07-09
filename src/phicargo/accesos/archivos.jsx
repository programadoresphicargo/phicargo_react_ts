import React, { useCallback, useState, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { AccesoContext } from './context';
import Viewer from './viewer';

const AppCamara = () => {
    const { fileList, setFileList, disabledFom, id_acceso } = useContext(AccesoContext);
    const [previewImage, setPreviewImage] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        if (disabledFom) return; // 🚫 No permitir si está deshabilitado

        const newFiles = acceptedFiles.map(file => {
            const url = URL.createObjectURL(file);
            return {
                uid: String(Date.now()),
                name: file.name,
                status: 'done',
                originFileObj: file,
                url,
            };
        });
        setFileList(prev => [...prev, ...newFiles]);
    }, [disabledFom, setFileList]);

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/*': [] },
        capture: 'environment',
        multiple: false,
        onDrop,
        disabled: disabledFom // 🛑 Bloquea la interacción
    });

    const handlePreview = (file) => {
        setPreviewImage(file.url);
        setPreviewOpen(true);
    };

    return (
        <div>
            <div
                {...getRootProps()}
                style={{
                    border: '2px dashed #999',
                    padding: 20,
                    textAlign: 'center',
                    borderRadius: 10,
                    background: disabledFom ? '#eee' : '#fafafa',
                    cursor: disabledFom ? 'not-allowed' : 'pointer',
                    opacity: disabledFom ? 0.6 : 1
                }}
            >
                <input {...getInputProps()} />
                <p>{disabledFom ? 'Carga deshabilitada' : 'Haz clic o usa la cámara'}</p>
            </div>

            <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {fileList.map((file, idx) => (
                    <div key={idx} onClick={() => handlePreview(file)} style={{ cursor: 'pointer' }}>
                        <img
                            src={file.url}
                            alt={file.name}
                            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                        />
                    </div>
                ))}
            </div>

            {previewOpen && previewImage && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                    }}
                    onClick={() => setPreviewOpen(false)}
                >
                    <img src={previewImage} alt="preview" style={{ maxWidth: '90%', maxHeight: '90%' }} />
                </div>
            )}

            <Viewer id={id_acceso} tabla={'prueba'}></Viewer>
        </div>
    );
};

export default AppCamara;
