import { useViewFiles } from '@/modules/core/hooks';
import { CircularProgress, IconButton, Backdrop } from '@mui/material';
import { Download, ErrorOutline } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import odooApi from '@/api/odoo-api';

export type FileItem = {
  idOnedrive: string;
  filename?: string;
};

interface Props {
  files: FileItem[];
}

export const FilesList = ({ files }: Props) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
      {files.map((file, idx) => (
        <Item key={`${file.idOnedrive}-${idx}`} file={file} />
      ))}
    </div>
  );
};

const Item = ({ file }: { file: FileItem }) => {
  const { errorEvidences, handleViewEvidence, loadingEvidences } = useViewFiles();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [errorImage, setErrorImage] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const extension = file.filename
    ? file.filename.split('.').pop()?.slice(0, 3).toUpperCase()
    : '???';
  const baseName = file.filename ? file.filename.split('.')[0] : file.idOnedrive;

  useEffect(() => {
    const downloadImage = async () => {
      setLoadingImage(true);
      setErrorImage(false);
      try {
        const { data: downloadUrl } = await odooApi.get(`/onedrive/download_link/${file.idOnedrive}`);
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error('Error fetching image');
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch (e) {
        console.error(e);
        setErrorImage(true);
      } finally {
        setLoadingImage(false);
      }
    };

    downloadImage();

    // Limpieza para liberar memoria cuando el componente se desmonte
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [file.idOnedrive]);

  return (
    <div
      key={file.idOnedrive}
      className="border rounded-md p-1 flex flex-col items-center hover:bg-gray-50 transition-colors"
    >
      <div className="relative w-full">
{/*
<div className="w-6 h-6 mx-auto flex items-center justify-center bg-gray-100 rounded">
  <span className="text-[0.6rem] text-gray-500 font-medium">{extension}</span>
</div>
*/}

        <div className="absolute top-0 right-0">
          {loadingEvidences[file.idOnedrive] || loadingImage ? (
            <CircularProgress size={14} />
          ) : errorEvidences[file.idOnedrive] || errorImage ? (
            <ErrorOutline color="error" fontSize="small" />
          ) : null}
        </div>
      </div>

      {/*
<Tooltip title={file.idOnedrive} placement="bottom">
  <p className="text-[0.65rem] text-center truncate w-full mt-1 px-1">{baseName}</p>
</Tooltip>
*/}

      {/* Imagen pequeña debajo */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`Preview of ${baseName}`}
          className="mt-2 max-w-full rounded-md shadow-md cursor-pointer"
          style={{ maxHeight: '100px', objectFit: 'contain' }}
          onClick={() => setModalOpen(true)}
        />
      )}

      {/* Modal para imagen grande */}
      <Backdrop
        open={modalOpen}
        onClick={() => setModalOpen(false)}
        style={{ zIndex: 1300, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={`Large preview of ${baseName}`}
            style={{ maxHeight: '90vh', maxWidth: '90vw', borderRadius: 8, boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}
          />
        )}
      </Backdrop>

      <IconButton
        size="small"
        className="text-xs mt-0.5"
        onClick={() => handleViewEvidence(file.idOnedrive)}
        disabled={loadingEvidences[file.idOnedrive]}
        aria-label={`Descargar ${baseName}`}
      >
        <Download fontSize="small" />
      </IconButton>
    </div>
  );
};
