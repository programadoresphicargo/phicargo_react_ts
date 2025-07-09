import React, { useState } from 'react';
import { Upload, Image, message } from 'antd';

const getBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

const AppCamara = () => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    return (
        <>
            <Upload
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={(file) => {
                    const isImage = file.type.startsWith('image/');
                    if (!isImage) {
                        message.error('¡Solo se permiten imágenes!');
                    }
                    return isImage || Upload.LIST_IGNORE;
                }}
            >
                {fileList.length >= 8 ? null : (
                    <label style={{ cursor: 'pointer' }}>
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setFileList([...fileList, {
                                        uid: String(Date.now()),
                                        name: file.name,
                                        status: 'done',
                                        originFileObj: file,
                                        url: URL.createObjectURL(file),
                                    }]);
                                }

                                // 🔧 Esto evita que se dispare automáticamente después
                                e.target.value = null;
                            }}
                        />
                        <div style={{ textAlign: 'center' }}>
                            <div>Usar cámara</div>
                        </div>
                    </label>
                )}
            </Upload>

            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: visible => setPreviewOpen(visible),
                        afterOpenChange: visible => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </>
    );
};

export default AppCamara;
