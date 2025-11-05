import { Badge, IconButton, Tooltip } from '@mui/material';
import { useMemo, useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@heroui/drawer";
import { Button } from "@heroui/button";
import type { MotumEventStatus } from '../../models';
import { MotumEventsHistoryList } from './MotumEventsHistoryList';
import { MotumEventsList } from './MotumEventsList';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import dayjs from 'dayjs';
import { useMotumEventsQueries } from '../../hooks/queries';
import { Tabs, Tab } from "@heroui/react";

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
    <>
      <Tooltip title="Alertas Motum" arrow>
        <Badge badgeContent={getMotumEventsQuery.data?.length} color="warning">
          <IconButton color="inherit" onClick={toggleDrawer(true)}>
            <WarningAmberIcon />
          </IconButton>
        </Badge>
      </Tooltip>
      <Drawer
        isOpen={open}
        onClose={toggleDrawer(false)}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">Alertas GPS</DrawerHeader>
              <DrawerBody>
                <Tabs
                  selectedKey={tab}
                  onSelectionChange={(value) => setTab(value as MotumEventStatus)}
                  aria-label="motum-alerts-tabs"
                >
                  <Tab key="pending" title="Sin Atender" />
                  <Tab key="attended" title="Historial" />
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
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

