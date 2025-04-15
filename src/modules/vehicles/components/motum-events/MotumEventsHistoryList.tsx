import { Alert, LoadingSpinner } from '@/components/ui';
import {
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

import Box from '@mui/material/Box';
import type { MotumEvent } from '../../models';
import { MotumEventsHistoryItem } from './MotumEventsHistoryItem';
import dayjs from 'dayjs';
import { useState } from 'react';

interface Props {
  isLoading: boolean;
  events: MotumEvent[] | undefined;
  setDateRange: (dateRange: [string, string] | null) => void;
}

export const MotumEventsHistoryList = ({
  isLoading,
  events,
  setDateRange,
}: Props) => {
  const [period, setPeriod] = useState('today');

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setPeriod(value);
    setDateRange(getDateRangeByPeriod(value));
  };

  return (
    <Box sx={{ width: 400, p: 2 }} role="presentation">
      <FormControl fullWidth>
        <InputLabel id="period-label">Periodo</InputLabel>
        <Select
          labelId="period-label"
          id="period-select"
          value={period}
          label="Periodo"
          onChange={handleChange}
        >
          <MenuItem value={'today'}>Hoy</MenuItem>
          <MenuItem value={'last-week'}>Última semana</MenuItem>
          <MenuItem value={'last-month'}>Último mes</MenuItem>
          <MenuItem value={'last-three-months'}>Últimos 3 meses</MenuItem>
        </Select>
      </FormControl>
      <Divider sx={{ my: 1 }} />
      {isLoading && <LoadingSpinner />}
      {events && events.length === 0 && (
        <Alert title="Sin eventos atendidos" color="success" />
      )}
      {events &&
        events.map((event) => (
          <MotumEventsHistoryItem key={event.id} event={event} />
        ))}
    </Box>
  );
};

const getDateRangeByPeriod = (period: string): [string, string] => {
  switch (period) {
    case 'today': {
      const today = dayjs().format('YYYY-MM-DD');
      return [today, today];
    }
    case 'last-week': {
      const lastWeek = dayjs().subtract(7, 'day').format('YYYY-MM-DD');
      const today = dayjs().format('YYYY-MM-DD');
      return [lastWeek, today];
    }
    case 'last-month': {
      const lastMonth = dayjs().subtract(1, 'month').format('YYYY-MM-DD');
      const today = dayjs().format('YYYY-MM-DD');
      return [lastMonth, today];
    }
    case 'last-three-months': {
      const lastThreeMonths = dayjs().subtract(3, 'month').format('YYYY-MM-DD');
      const today = dayjs().format('YYYY-MM-DD');
      return [lastThreeMonths, today];
    }
    default: {
      const today = dayjs().format('YYYY-MM-DD');
      return [today, today];
    }
  }
};

