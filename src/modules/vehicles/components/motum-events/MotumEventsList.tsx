import { Button, LoadingSpinner } from '@/components/ui';
import { Divider, IconButton, Paper, Stack, Typography } from '@mui/material';

import Box from '@mui/material/Box';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import type { MotumEvent } from '../../models';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import RoomIcon from '@mui/icons-material/Room';

interface Props {
  toggleDrawer: (open: boolean) => () => void;
  isLoading: boolean;
  events: MotumEvent[] | undefined;
}

export const MotumEventsList = ({ toggleDrawer, isLoading, events }: Props) => {
  const onAttend = (eventId: number) => {
    console.log(eventId);
  };

  return (
    <Box
      sx={{ width: 350, p: 2 }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      {isLoading && <LoadingSpinner />}
      {events &&
        events.map((event) => (
          <Paper
            key={event.id}
            elevation={3}
            sx={{ p: 2, mb: 2, borderRadius: 2 }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <ReportGmailerrorredIcon color="error" />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {event.eventTypeName}
                </Typography>
                {event.eventDescription && (
                  <Typography variant="body2" color="text.secondary">
                    {event.eventDescription}
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  color="primary"
                  sx={{ fontStyle: 'italic' }}
                >
                  Estado: {event.status}
                </Typography>
              </Box>
              <IconButton
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(
                    `https://www.google.com/maps?q=${event.latitude},${event.longitude}`,
                    '_blank',
                  );
                }}
              >
                <RoomIcon />
              </IconButton>
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="outlined"
                size="small"
                startIcon={<CheckCircleOutlineIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  onAttend(event.id);
                }}
              >
                Atender
              </Button>
            </Box>
          </Paper>
        ))}
    </Box>
  );
};