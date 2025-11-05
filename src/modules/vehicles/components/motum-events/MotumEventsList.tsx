import { Alert, LoadingSpinner } from '@/components/ui';

import Box from '@mui/material/Box';
import type { MotumEvent } from '../../models';
import { MotumEventItem } from './MotumEventItem';
import Stack from '@mui/material/Stack';
import { Progress } from "@heroui/react";

interface Props {
  toggleDrawer: (open: boolean) => () => void;
  isLoading: boolean;
  events: MotumEvent[] | undefined;
}

export const MotumEventsList = ({ isLoading, events }: Props) => {
  return (
    <Box
      role="presentation"
    >
      {isLoading && <Progress isIndeterminate aria-label="Loading..." className="max-w-md" size="sm" />}

      {events && events.length === 0 && (
        <Alert title="No hay eventos pendientes" color="success" />
      )}

      <Stack spacing={2}>
        {events && !isLoading &&
          events.map((event) => (
            <MotumEventItem key={event.id} event={event} />
          ))}
      </Stack>
    </Box>
  );
};

