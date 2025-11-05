import { Alert, LoadingSpinner } from '@/components/ui';

import Box from '@mui/material/Box';
import type { MotumEvent } from '../../models';
import { MotumEventItem } from './MotumEventItem';
import Stack from '@mui/material/Stack';

interface Props {
  toggleDrawer: (open: boolean) => () => void;
  isLoading: boolean;
  events: MotumEvent[] | undefined;
}

export const MotumEventsList = ({ isLoading, events }: Props) => {
  return (
    <Box
      sx={{ width: 400 }}
      role="presentation"
    >
      {isLoading && <LoadingSpinner />}

      {events && events.length === 0 && (
        <Alert title="No hay eventos pendientes" color="success" />
      )}

      <Stack spacing={2}>
        {events &&
          events.map((event) => (
            <MotumEventItem key={event.id} event={event} />
          ))}
      </Stack>
    </Box>
  );
};

