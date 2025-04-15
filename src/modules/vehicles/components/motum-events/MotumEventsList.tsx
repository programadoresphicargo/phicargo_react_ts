import { Alert, LoadingSpinner } from '@/components/ui';

import Box from '@mui/material/Box';
import type { MotumEvent } from '../../models';
import { MotumEventItem } from './MotumEventItem';

interface Props {
  toggleDrawer: (open: boolean) => () => void;
  isLoading: boolean;
  events: MotumEvent[] | undefined;
}

export const MotumEventsList = ({ toggleDrawer, isLoading, events }: Props) => {
  return (
    <Box
      sx={{ width: 400, p: 2 }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      {isLoading && <LoadingSpinner />}
      {events && events.length === 0 && (
        <Alert title="No hay eventos pendientes" color="success" />
      )}
      {events &&
        events.map((event) => <MotumEventItem key={event.id} event={event} />)}
    </Box>
  );
};

