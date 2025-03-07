import 'rsuite/dist/rsuite-no-reset.min.css';

import { BackButton } from '@/components/ui/BackButton';
import Card from './Card';
import { Checkbox } from '@heroui/react';
import { DateRangePicker } from 'rsuite';
import dayjs from 'dayjs';
import { useGlobalContext } from '../../hook/useGlobalContext';
import { useMemo } from 'react';
import { useRecordsQuery } from '../../hook/useRecordsQuery';

const { after } = DateRangePicker;

const Header = () => {
  const { month, setMonth, branchId, setBranchId } = useGlobalContext();

  const {
    recordsQuery: { data: records, isFetching },
  } = useRecordsQuery(month, branchId);

  const dayRecord = useMemo(() => {
    if (!records) return;
    return records.find((record) => dayjs(record.date).isSame(dayjs(), 'day'));
  }, [records]);

  return (
    <div
      className="max-w-full mx-auto text-white px-4 py-1 flex flex-col"
      style={{
        // background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 400"><rect width="1920" height="400" fill="%23D9DEEA" /><mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="400"><rect width="1920" height="400" fill="%23D9DEEA" /></mask><g mask="url(%23mask0)"><path d="M1059.48 308.024C1152.75 57.0319 927.003 -103.239 802.47 -152.001L1805.22 -495.637L2095.53 351.501L1321.23 616.846C1195.12 618.485 966.213 559.015 1059.48 308.024Z" fill="%23C0CBDD" /><path d="M1333.22 220.032C1468.66 -144.445 1140.84 -377.182 960 -447.991L2416.14 -947L2837.71 283.168L1713.32 668.487C1530.19 670.868 1197.78 584.509 1333.22 220.032Z" fill="%238192B0" /></g></svg>')`,
        // backgroundSize: 'cover',
        // backgroundPosition: 'center',
        background: 'linear-gradient(90deg, #0b2149, #002887)',
      }}
    >
      <div className="flex justify-between items-center flex-wrap gap-4">
        <BackButton route="/reportes" />

        <div className="mx-2">
          <h1 className="m-0 p-0 text-base text-gray-100 font-bold uppercase">
            Operaciones Diarias
          </h1>
          <p className="my-1 text-sm text-gray-300">
            {'Día: ' + dayjs().format('DD/MM/YYYY')}
          </p>
        </div>

        <div className="flex gap-2 flex-1">
          <Card
            title="Total de Viajes"
            content={isFetching ? '...' : dayRecord?.total || 0}
          />
          <Card
            title="Meta"
            content={isFetching ? '...' : dayRecord?.meta || 0}
          />
          <Card
            title="Diferencia"
            content={isFetching ? '...' : dayRecord?.difference || 0}
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-2 bg-gray-200/20 backdrop-blur-sm py-1.5 px-2 rounded-xl">
            <Checkbox
              isSelected={branchId === 1}
              onValueChange={() => setBranchId(1)}
              classNames={{ label: 'text-white uppercase' }}
              size="sm"
            >
              VER
            </Checkbox>
            <Checkbox
              isSelected={branchId === 9}
              onValueChange={() => setBranchId(9)}
              classNames={{ label: 'text-white uppercase' }}
              size="sm"
            >
              MZN
            </Checkbox>
            <Checkbox
              isSelected={branchId === 2}
              onValueChange={() => setBranchId(2)}
              classNames={{ label: 'text-white uppercase' }}
              size="sm"
            >
              MEX
            </Checkbox>
          </div>
        </div>

        <div className="">
          <DateRangePicker
            hoverRange="month"
            oneTap
            showOneCalendar
            placeholder="Selecciona Un Mes"
            size="sm"
            format="dd/MM/yyyy"
            character=" - "
            showWeekNumbers
            value={month}
            onChange={setMonth}
            shouldDisableDate={after(
              dayjs().endOf('month').add(1, 'month').toDate(),
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
