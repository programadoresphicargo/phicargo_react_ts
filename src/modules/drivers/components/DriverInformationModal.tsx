import { Tab, Tabs } from '@heroui/react';

import type { Driver } from '../models';
import { DriverForm } from './DriverForm';
import { DriverIncidences } from './incidences/DriverIncidences';
import { DriverManeuver } from './maneuvers/DriverManeuvers';
import DriverPermissions from './unavailabilities/DriverPermissions';
import { MuiModal } from '@/components';
import { TrailerAssignment } from './TrailerAssignment';

interface Props {
  open: boolean;
  onClose: () => void;
  driver: Driver;
}

export const DriverInformationModal = ({ open, onClose, driver }: Props) => {
  return (
    <MuiModal
      open={open}
      onClose={onClose}
      showFooter={false}
      maxWidth="md"
      fullWidth={true}
      header={
        <h2 className="uppercase font-thin">
          operador: <span className="font-bold">{driver.name}</span>
        </h2>
      }
    >
      <Tabs
        aria-label="driver-sections"
        variant="underlined"
        color="primary"
        fullWidth
        classNames={{
          panel: 'px-4',
          tabContent: 'font-bold uppercase',
        }}
      >
        <Tab key="permissions" title="Permisos">
          <DriverPermissions driver={driver} />
        </Tab>
        <Tab key="incidences" title="Incidencias">
          <DriverIncidences driver={driver} />
        </Tab>
        <Tab key="driver-form" title="Información">
          <DriverForm driver={driver} />
        </Tab>
        <Tab key="trailer-assign" title="Remolques">
          <TrailerAssignment driver={driver} />
        </Tab>
        <Tab key="meneuvers" title="Maniobras">
          <DriverManeuver driverId={driver!.id} />
        </Tab>
      </Tabs>
    </MuiModal>
  );
};

