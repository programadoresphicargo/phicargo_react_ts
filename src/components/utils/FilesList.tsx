import { useViewFiles } from '@/modules/core/hooks';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import { Download, ErrorOutline } from '@mui/icons-material';

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
  const { errorEvidences, handleViewEvidence, loadingEvidences } =
    useViewFiles();

  // Usa filename si existe, si no, usa idOnedrive como fallback
  const extension = file.filename
    ? file.filename.split('.').pop()?.slice(0, 3).toUpperCase()
    : '???';
  const baseName = file.filename
    ? file.filename.split('.')[0]
    : file.idOnedrive;

  return (
    <div
      key={file.idOnedrive}
      className="border rounded-md p-1 flex flex-col items-center hover:bg-gray-50 transition-colors"
    >
      <div className="relative w-full">
        <div className="w-6 h-6 mx-auto flex items-center justify-center bg-gray-100 rounded">
          <span className="text-[0.6rem] text-gray-500 font-medium">
            {extension}
          </span>
        </div>

        <div className="absolute top-0 right-0">
          {loadingEvidences[file.idOnedrive] ? (
            <CircularProgress size={14} />
          ) : errorEvidences[file.idOnedrive] ? (
            <ErrorOutline color="error" fontSize="small" />
          ) : null}
        </div>
      </div>

      <Tooltip title={file.idOnedrive} placement="bottom">
        <p className="text-[0.65rem] text-center truncate w-full mt-1 px-1">
          {baseName}
        </p>
      </Tooltip>

      <IconButton
        size="small"
        className="text-xs mt-0.5"
        onClick={() => handleViewEvidence(file.idOnedrive)}
        disabled={loadingEvidences[file.idOnedrive]}
      >
        <Download fontSize="small" />
      </IconButton>
    </div>
  );
};

