import { useState } from 'react';
import { CloudUpload, Delete } from '@mui/icons-material';

interface Props {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  acceptedFileTypes?: string;
  label?: string;
}

export const FileUploadInput = ({
  files,
  setFiles,
  acceptedFileTypes,
  label = 'Subir archivos',
}: Props) => {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      setPreviews(selectedFiles.map((file) => URL.createObjectURL(file)));
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  return (
    <>
      <label className="flex items-center justify-center gap-2 p-2 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors h-14">
        <CloudUpload className="text-blue-500" fontSize="small" />
        <span className="text-xs font-medium">{label}</span>
        <input
          type="file"
          className="hidden"
          multiple
          accept={acceptedFileTypes || 'image/*'}
          data-testid="file-input"
          onChange={handleFileChange}
        />
      </label>

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt="Preview"
                className="w-8 h-8 object-cover rounded-sm border"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeFile(index);
                }}
                className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Delete sx={{ fontSize: 8 }} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="text-xs text-gray-500">
          {files.length} archivo{files.length !== 1 ? 's' : ''} seleccionado
          {files.length !== 1 ? 's' : ''}
        </div>
      )}
    </>
  );
};
