import { useState } from 'react';
import { FilesService } from '../services';

export const useViewFiles = () => {
  const [loadingEvidences, setLoadingEvidences] = useState<
    Record<string, boolean>
  >({});
  const [errorEvidences, setErrorEvidences] = useState<Record<string, boolean>>(
    {},
  );

  const handleViewEvidence = async (fileId: string) => {
    try {
      setLoadingEvidences((prev) => ({ ...prev, [fileId]: true }));
      setErrorEvidences((prev) => ({ ...prev, [fileId]: false }));

      const url = await FilesService.getFilePublicUrl(fileId);

      window.open(url, '_blank');
    } catch (error) {
      setErrorEvidences((prev) => ({ ...prev, [fileId]: true }));
      console.error('Error al cargar la evidencia:', error);
    } finally {
      setLoadingEvidences((prev) => ({ ...prev, [fileId]: false }));
    }
  };

  return {
    loadingEvidences,
    errorEvidences,
    handleViewEvidence,
  };
};

