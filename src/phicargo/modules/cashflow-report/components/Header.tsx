import { Button, Tab, Tabs } from '@nextui-org/react';
import { useLoadPrevious, useWeekContext } from '../hooks';

import AlertDialog from './AlertDialog';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HeaderCards from './HeaderCards';
import WeekSelector from './WeekSelector';
import { isSameWeek } from '../utils';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const { activeWeekId, weekSelected } = useWeekContext();
  const { loadPrevious, isPending } = useLoadPrevious();

  const [loadPreviousConfirm, setLoadPreviousConfirm] = useState(false);

  const onLoadPreviousWeek = () => {
    if (!weekSelected || !activeWeekId) return;
    loadPrevious();
    setLoadPreviousConfirm(false);
  };

  return (
    <>
      <div
        className="max-w-full mx-auto text-white px-4 py-2 flex flex-col"
        style={{
          background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 400"><rect width="1920" height="400" fill="%23D9DEEA" /><mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="400"><rect width="1920" height="400" fill="%23D9DEEA" /></mask><g mask="url(%23mask0)"><path d="M1059.48 308.024C1152.75 57.0319 927.003 -103.239 802.47 -152.001L1805.22 -495.637L2095.53 351.501L1321.23 616.846C1195.12 618.485 966.213 559.015 1059.48 308.024Z" fill="%23C0CBDD" /><path d="M1333.22 220.032C1468.66 -144.445 1140.84 -377.182 960 -447.991L2416.14 -947L2837.71 283.168L1713.32 668.487C1530.19 670.868 1197.78 584.509 1333.22 220.032Z" fill="%238192B0" /></g></svg>')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex justify-between items-center flex-wrap">
          <Button
            isIconOnly
            aria-label="back"
            onClick={() => navigate('/reportes')}
            className="bg-gray-100 rounded-full p-2 mr-2 shadow-md hover:bg-gray-200 transition"
          >
            <ArrowBackIcon />
          </Button>

          <div className="mr-2">
            <Tabs
              aria-label="Options"
              isVertical
              color="primary"
              variant="solid"
              onSelectionChange={(e) => navigate(`/reportes/balance/${e}`)}
            >
              <Tab key="collect" title="Reporte de Cobro" />
              <Tab key="payment" title="Reporte de cuentas por pagar" />
            </Tabs>
          </div>

          <div className="flex gap-2 flex-1">
            <HeaderCards />
            <div className="flex flex-col gap-2 w-1/6">
              <WeekSelector />
              <Button
                color="primary"
                onClick={() => setLoadPreviousConfirm(true)}
                isLoading={isPending}
                isDisabled={!isSameWeek(weekSelected!)}
              >
                Traer Anteriores
              </Button>
            </div>
          </div>
        </div>
      </div>
      {loadPreviousConfirm && (
        <AlertDialog
          alert="¿Confirmar la carga?"
          description="¿Estás seguro cargar los pagos pendientes de la semana pasada?"
          onConfirm={onLoadPreviousWeek}
          onClose={() => setLoadPreviousConfirm(false)}
        />
      )}
    </>
  );
};

export default Header;
