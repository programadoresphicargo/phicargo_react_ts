import type { Incident } from '../models';
import { FilesList } from '@/components/utils/FilesList';

interface Props {
  incident: Incident;
}

export const EvidencesList = ({ incident }: Props) => {
  return <FilesList files={incident.evidences} />;
};

