import { useEffect, useState } from 'react';
import { Alert } from '@heroui/react';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { MotumAlertsPanel } from '@/modules/vehicles/components/motum-events/MotumAlertsPanel';
import Notificaciones from './panel_notificaciones/panel';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ReportIcon from '@mui/icons-material/Report';
import odooApi from '@/api/odoo-api';
import { useDisclosure } from '@heroui/react';
import CustomNavbar from '@/pages/CustomNavbar';
import { pages } from './pages';
import ProblemasOperadores from './problemas_operadores/panel';

function NavbarTravel() {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenPO,
    onOpen: onOpenPO,
    onOpenChange: onOpenChangePO,
  } = useDisclosure();

  const [numProblemasOperador, setNumPO] = useState(0);

  const getReportesNoAtendidos = async () => {
    try {
      const response = await odooApi.get('/problemas_operadores/no_atendidos/');
      const numRegistros = response.data?.length ?? 0;
      setNumPO(numRegistros);

    } catch (error) {
      console.error('Error al obtener los datos:', error);
      return 0;
    }
  };

  useEffect(() => {
    getReportesNoAtendidos();
  }, []);

  return (
    <>
      {numProblemasOperador > 0 && (
        <Alert
          color="danger"
          variant="solid"
          title="Atención: Existen problemas de operadores pendientes de atención."
          description={`${numProblemasOperador} reportes pendientes de atención`}
          radius="none"
        />
      )}
      <CustomNavbar
        pages={pages}
        extraButtons={
          <>
            <IconButton size="large" color="inherit" onClick={onOpenPO}>
              <Badge badgeContent={numProblemasOperador} color="error">
                <ReportIcon />
              </Badge>
            </IconButton>

            <IconButton size="large" color="inherit" onClick={onOpen}>
              <Badge badgeContent={1} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <MotumAlertsPanel />
            </Box>
          </>}
      >
      </CustomNavbar>

      <Notificaciones
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
      />

      <ProblemasOperadores
        isOpen={isOpenPO}
        onOpenChange={onOpenChangePO}
      />

    </>
  );
}

export default NavbarTravel;

