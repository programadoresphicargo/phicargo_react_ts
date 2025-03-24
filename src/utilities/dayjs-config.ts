import 'dayjs/locale/es-mx';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.locale('es-mx');
dayjs.extend(utc);
dayjs.extend(timezone);


export default dayjs;

