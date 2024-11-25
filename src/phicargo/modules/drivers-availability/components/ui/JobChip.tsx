import Chip from '@mui/material/Chip';
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
      return 'info';
    default:
      return 'default';
  }
};

const JobChip = ({ job }: Props) => {
  return <Chip label={job} color={getJobColor(job)} size='small' />;
};

export default JobChip;
