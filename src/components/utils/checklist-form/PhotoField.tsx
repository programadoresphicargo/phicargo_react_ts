import { FieldValues, Path, useFormContext } from 'react-hook-form';
import type { ChecklistItem } from './types';
import { Typography } from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';
import { useRef } from 'react';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

interface Props<T extends FieldValues> {
  name: Path<T>;
  item: ChecklistItem;
}

export const PhotoField = <T extends FieldValues>({ item, name }: Props<T>) => {
  const {
    setValue,
    setError,
    clearErrors,
    formState: { errors },
    watch,
  } = useFormContext();

  const inputRef = useRef<HTMLInputElement>(null);
  let watchedFiles: FileList | null = null;
  const files = watch(name);
  if (files && typeof files === 'object' && 'length' in files) {
    watchedFiles = files as FileList;
  }

  const handleRemove = (idx: number) => {
    if (!watchedFiles) return;
    const dt = new DataTransfer();
    Array.from(watchedFiles).forEach((file, i) => {
      if (i !== idx) dt.items.add(file);
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(name, dt.files as any, { shouldValidate: true });

    if (dt.files.length === 0 && inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(name, files as any, { shouldValidate: true });
    validatePhotoCount(files);
  };

  // Nueva función para validar el número de fotos
  const validatePhotoCount = (files: FileList | null) => {
    if (item.photoCount) {
      if (!files || files.length === 0) {
        setError(name, { type: 'manual', message: 'Debes subir al menos una foto' });
      } else if (files.length !== item.photoCount) {
        setError(name, { type: 'manual', message: `Debes subir exactamente ${item.photoCount} foto(s)` });
      } else {
        clearErrors(name);
      }
    }
  };

  return (
    <>
      <Typography className="mb-2">{item.label}</Typography>
      <div className="p-2 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50 transition-colors flex items-center min-h-[64px]">
        {watchedFiles && watchedFiles.length > 0 ? (
          <>
            <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-200 pt-1">
              {Array.from(watchedFiles).map((file, idx) => (
                <div key={idx} className="relative group flex-shrink-0">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-12 h-12 object-cover rounded-sm border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    tabIndex={-1}
                  >
                    <Delete sx={{ fontSize: 12 }} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
            <label className="flex items-center justify-center cursor-pointer ml-2 flex-shrink-0">
              <AddAPhotoIcon className="text-blue-500" fontSize="medium" />
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={e => {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;
                  const dt = new DataTransfer();
                  if (watchedFiles) {
                    Array.from(watchedFiles).forEach(f => dt.items.add(f));
                  }
                  dt.items.add(files[0]);
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  setValue(name, dt.files as any, { shouldValidate: true });
                  validatePhotoCount(dt.files);
                  if (inputRef.current) inputRef.current.value = '';
                }}
                ref={inputRef}
                className="hidden"
              />
            </label>
            <label className="flex items-center justify-center cursor-pointer ml-3 flex-shrink-0">
              <CloudUpload className="text-blue-500" fontSize="medium" />
              <input
                type="file"
                accept="image/*"
                multiple={Boolean(item.photoCount && item.photoCount > 1)}
                onChange={handleInputChange}
                className="hidden"
              />
            </label>
          </>
        ) : (
          <div className="flex items-center justify-center gap-4 w-full h-14">
            <label className="flex items-center justify-center gap-2 cursor-pointer">
              <AddAPhotoIcon className="text-blue-500" fontSize="small" />
              <span className="text-xs font-medium">Tomar foto</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleInputChange}
                className="hidden"
              />
            </label>
            <div className="w-px h-8 bg-gray-300"></div>
            <label className="flex items-center justify-center gap-2 cursor-pointer">
              <CloudUpload className="text-blue-500" fontSize="small" />
              <span className="text-xs font-medium">Subir desde galería</span>
              <input
                type="file"
                accept="image/*"
                multiple={Boolean(item.photoCount && item.photoCount > 1)}
                onChange={handleInputChange}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>
      {watchedFiles && watchedFiles.length > 0 && (
        <div className="text-xs text-gray-500 mt-1">
          {watchedFiles.length} archivo{watchedFiles.length !== 1 ? 's' : ''}{' '}
          seleccionado{watchedFiles.length !== 1 ? 's' : ''}
        </div>
      )}
      {errors[item.name] && (
        <span className="text-red-400 text-xs">
          {errors[item.name]?.message as string}
        </span>
      )}
    </>
  );
};

