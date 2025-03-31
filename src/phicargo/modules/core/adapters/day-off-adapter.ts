import type { DayOff, DayOffCreate } from '../models';
import type { DayOffApi, DayOffCreateApi } from '../models/api';

import dayjs from 'dayjs';

export class DayOffAdapter {
  static toDayOff(data: DayOffApi): DayOff {
    return {
      id: data.id,
      dateOff: dayjs(data.date_off),
      type: data.type,
      description: data.description,
    };
  }

  static toDayOffCreateApi(data: DayOffCreate): DayOffCreateApi {
    return {
      store_id: data.storeId,
      date_off: data.dateOff.format('YYYY-MM-DD'),
      type: data.type,
      description: data.description,
    };
  }
}

