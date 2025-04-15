import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';

import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { MotumEvent } from '../../models';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import RoomIcon from '@mui/icons-material/Room';

interface Props {
  event: MotumEvent;
}

export const MotumEventsHistoryItem = ({ event }: Props) => {
  return (
    <Accordion onChange={(e) => e.stopPropagation()}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
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
              Estado: {event.status} | Unidad: {event.vehicleName}
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
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" color="text.secondary">
          {event.comment}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="caption"
              color="primary"
              sx={{ fontStyle: 'italic' }}
            >
              Atendido por: {event.attendedBy} |{' '}
              {event.attendedAt?.format('DD/MM/YYYY hh:mm A')}
            </Typography>
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

