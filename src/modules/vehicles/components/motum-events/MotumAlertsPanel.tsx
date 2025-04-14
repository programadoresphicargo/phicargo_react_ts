import { Badge, IconButton } from '@mui/material';

import Drawer from '@mui/material/Drawer';
import { MotumEventsList } from './MotumEventsList';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useMotumEventsQueries } from '../../hooks/queries';
import { useState } from 'react';

export const MotumAlertsPanel = () => {
  const [open, setOpen] = useState(false);

  const { getMotumEventsQuery } = useMotumEventsQueries();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <div>
      <Badge badgeContent={getMotumEventsQuery.data?.length} color="primary">
        <IconButton color="warning" onClick={toggleDrawer(true)}>
          <WarningAmberIcon />
        </IconButton>
      </Badge>
      <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
        <MotumEventsList
          toggleDrawer={toggleDrawer}
          isLoading={getMotumEventsQuery.isLoading}
          events={getMotumEventsQuery.data}
        />
      </Drawer>
    </div>
  );
};

