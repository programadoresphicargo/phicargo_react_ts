import type { DriverBonusMonth } from '../models';
import type { DriverBonusMonthApi } from '../models/api';

export class DriverBonusAdapter {
  static toDriverBonusMonth(data: DriverBonusMonthApi): DriverBonusMonth {
    const id = String(data.month) + String(data.year);

    return {
      id: Number(id),
      month: data.month,
      year: data.year,
    };
  }
}

