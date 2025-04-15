import { Badge, IconButton, Tab, Tabs } from '@mui/material';
import { useMemo, useState } from 'react';

import Drawer from '@mui/material/Drawer';
import type { MotumEventStatus } from '../../models';
import { MotumEventsHistoryList } from './MotumEventsHistoryList';
import { MotumEventsList } from './MotumEventsList';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import dayjs from 'dayjs';
import { useMotumEventsQueries } from '../../hooks/queries';

export const MotumAlertsPanel = () => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<MotumEventStatus>('pending');
  const [dateRagen, setDateRange] = useState<[string, string] | null>(null);

  const conf = useMemo(() => {
    const pendingStartDate = dayjs().subtract(2, 'day').format('YYYY-MM-DD');
    const pendingEndDate = dayjs().format('YYYY-MM-DD');
    return {
      status: tab,
      startDate: tab === 'attended' ? dateRagen?.[0] : pendingStartDate,
      endDate: tab === 'attended' ? dateRagen?.[1] : pendingEndDate,
    };
  }, [tab, dateRagen]);

  const { getMotumEventsQuery } = useMotumEventsQueries(conf);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
    setTab('pending');
  };

  return (
    <div>
      <Badge badgeContent={getMotumEventsQuery.data?.length} color="warning">
        <IconButton
          sx={{ p: 0.5 }}
          size="small"
          color="warning"
          onClick={toggleDrawer(true)}
        >
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
          value={tab}
          onChange={(_, value) => setTab(value)}
          textColor="primary"
          variant="fullWidth"
          indicatorColor="primary"
          aria-label="motum-alerts-tabs"
        >
          <Tab value="pending" label="Sin Atender" />
          <Tab value="attended" label="Historial" />
        </Tabs>
        {tab === 'pending' && (
          <MotumEventsList
            toggleDrawer={toggleDrawer}
            isLoading={getMotumEventsQuery.isLoading}
            events={getMotumEventsQuery.data}
          />
        )}
        {tab === 'attended' && (
          <MotumEventsHistoryList
            isLoading={getMotumEventsQuery.isLoading}
            events={getMotumEventsQuery.data}
            setDateRange={setDateRange}
          />
        )}
      </Drawer>
    </div>
  );
};

