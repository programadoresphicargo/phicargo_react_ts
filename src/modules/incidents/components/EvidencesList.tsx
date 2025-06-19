import { useViewFiles } from '@/modules/core/hooks';
import type { Incident } from '../models';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import { Download, ErrorOutline } from '@mui/icons-material';

interface Props {
  incident: Incident;
}

export const EvidencesList = ({ incident }: Props) => {
  const { errorEvidences, handleViewEvidence, loadingEvidences } =
    useViewFiles();

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
      {incident.evidences.map((evidence) => (
        <div
          key={evidence.idOnedrive}
          className="border rounded-md p-1 flex flex-col items-center hover:bg-gray-50 transition-colors"
        >
          <div className="relative w-full">
            <div className="w-6 h-6 mx-auto flex items-center justify-center bg-gray-100 rounded">
              <span className="text-[0.6rem] text-gray-500 font-medium">
                {evidence.filename.split('.').pop()?.slice(0, 3).toUpperCase()}
              </span>
            </div>

            <div className="absolute top-0 right-0">
              {loadingEvidences[evidence.idOnedrive] ? (
                <CircularProgress size={14} />
              ) : errorEvidences[evidence.idOnedrive] ? (
                <ErrorOutline color="error" fontSize="small" />
              ) : null}
            </div>
          </div>

          <Tooltip title={evidence.filename} placement="bottom">
            <p className="text-[0.65rem] text-center truncate w-full mt-1 px-1">
              {evidence.filename.split('.')[0]}
            </p>
          </Tooltip>

          <IconButton
            size="small"
            className="text-xs mt-0.5"
            onClick={() => handleViewEvidence(evidence.idOnedrive)}
            disabled={loadingEvidences[evidence.idOnedrive]}
          >
            <Download fontSize="small" />
          </IconButton>
        </div>
      ))}
    </div>
  );
};

