import { Tab, Tabs } from '@heroui/react';

import type { Driver } from '../models';
import { DriverForm } from './DriverForm';
import DriverPermissions from './unavailabilities/DriverPermissions';
import { ManeuverDriverTimeline } from './ManeuverDriverTimeline';
import { Modal } from '@/components';

interface Props {
  open: boolean;
  onClose: () => void;
  driver: Driver;
}

export const DriverInformationModal = ({ open, onClose, driver }: Props) => {
  return (
    <Modal
      isOpen={open}
      onOpenChange={onClose}
      showFooter={false}
      header={
        <h2 className="uppercase font-thin">
          operador: <span className="font-bold">{driver.name}</span>
        </h2>
      }
      size="3xl"
    >
      <Tabs 
        aria-label="driver-sections"
        variant='underlined'
        color='primary'
        fullWidth
        classNames={{
          panel: 'px-4',
        }}
      >
        <Tab key="permissions" title="Permisos">
          {driver && <DriverPermissions driver={driver} />}
        </Tab>
        <Tab key="incidences" title="Incidencias">
          <h2>Incidencias</h2>
        </Tab>
        <Tab key="driver-form" title="Información">
          <DriverForm driver={driver} />
        </Tab>
        <Tab key="meneuvers" title="Maniobras">
          {driver && <ManeuverDriverTimeline driverId={driver!.id} />}
        </Tab>
      </Tabs>
    </Modal>
  );
};

