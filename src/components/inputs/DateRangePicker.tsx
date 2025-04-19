import 'rsuite/dist/rsuite-no-reset.min.css';

import {
  DateRangePickerProps,
  DateRangePicker as RSDateRangePicker,
} from 'rsuite';

export const DateRangePicker = (props: DateRangePickerProps) => {
  return <RSDateRangePicker as="div" {...props} />;
};

