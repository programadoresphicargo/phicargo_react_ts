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
import { FilterMotumEventsList } from './FilterMotumEventsList';

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

  const [selectedEventType, setSelectedEventType] = useState<String | null>(null);

  const filteredEvents = useMemo(() => {
    if (!selectedEventType) return getMotumEventsQuery.data;
    return getMotumEventsQuery.data?.filter(
      (e) => String(e.eventType) === selectedEventType
    );
  }, [selectedEventType, getMotumEventsQuery.data]);

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
        size="lg"
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">Alertas GPS</DrawerHeader>
              <div className="pl-6 flex items-center gap-4">
                <Button
                  color='success'
                  className='text-white'
                  onPress={() => getMotumEventsQuery.refetch()}
                  isLoading={getMotumEventsQuery.isFetching}
                  radius='full'
                >
                  Recargar
                </Button>
                <FilterMotumEventsList
                  events={getMotumEventsQuery.data}
                  onSelectEventType={setSelectedEventType}>
                </FilterMotumEventsList>
              </div>
              <DrawerBody>
                <Tabs
                  selectedKey={tab}
                  onSelectionChange={(value) => setTab(value as MotumEventStatus)}
                  color='primary'
                  radius='full'
                >
                  <Tab key="pending" title="Sin Atender" />
                  <Tab key="attended" title="Historial" />
                </Tabs>
                {tab === 'pending' && (
                  <MotumEventsList
                    toggleDrawer={toggleDrawer}
                    isLoading={getMotumEventsQuery.isFetching}
                    events={filteredEvents}
                    refresh={getMotumEventsQuery.refetch}
                  />
                )}
                {tab === 'attended' && (
                  <MotumEventsHistoryList
                    isLoading={getMotumEventsQuery.isFetching}
                    events={getMotumEventsQuery.data}
                    setDateRange={setDateRange}
                  />
                )}
              </DrawerBody>
              <DrawerFooter>
                <Button color="success" className='text-white' onPress={() => window.open("/eventos_gps", "_blank")} fullWidth radius='full'>
                  Ver todos los eventos
                </Button>
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

