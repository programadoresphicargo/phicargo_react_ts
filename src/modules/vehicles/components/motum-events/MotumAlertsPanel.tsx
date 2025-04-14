import { Badge, IconButton, Tab, Tabs } from '@mui/material';

import Drawer from '@mui/material/Drawer';
import { MotumEventsList } from './MotumEventsList';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useMotumEventsQueries } from '../../hooks/queries';
import { useState } from 'react';

export const MotumAlertsPanel = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('alerts');

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };  

  const { getMotumEventsQuery } = useMotumEventsQueries();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <div>
      <Badge badgeContent={getMotumEventsQuery.data?.length} color="warning">
        <IconButton color="warning" onClick={toggleDrawer(true)}>
          <WarningAmberIcon />
        </IconButton>
      </Badge>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        anchor="right"
        slotProps={{
          paper: {
            sx: {
              borderTopLeftRadius: 16,
              borderBottomLeftRadius: 16,
            },
          },
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="primary"
          variant="fullWidth"
          indicatorColor="primary"
          aria-label="motum-alerts-tabs"
        >
          <Tab value="alerts" label="Sin Atender" />
          <Tab value="history" label="Historial" />
        </Tabs>
        <MotumEventsList
          toggleDrawer={toggleDrawer}
          isLoading={getMotumEventsQuery.isLoading}
          events={getMotumEventsQuery.data}
        />
      </Drawer>
    </div>
  );
};

