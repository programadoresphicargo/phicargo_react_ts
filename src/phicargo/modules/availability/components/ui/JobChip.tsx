import { Chip } from '@nextui-org/react';
import type { Job } from '../../models/driver-model';

interface Props {
  job: Job;
}

const getJobColor = (job: Job) => {
  switch (job) {
    case 'OPERADOR':
      return 'primary';
    case 'MOVEDOR':
      return 'secondary';
    case 'OPERADOR POSTURERO':
      return 'warning';
    default:
      return 'default';
  }
};

const JobChip = ({ job }: Props) => {
  return (
    <Chip color={getJobColor(job)} size="sm">
      {job}
    </Chip>
  );
};

export default JobChip;
