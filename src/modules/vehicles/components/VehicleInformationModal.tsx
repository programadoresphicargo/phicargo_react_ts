import { Tab, Tabs } from '@heroui/react';

import { Modal } from '@/components';
import { Posturas } from './Posturas';
import type { Vehicle } from '../models';
import VehicleForm from './VehicleForm';
import AssignmentsDriver from './Assignments';
import HistoryChanges from './HistoryChanges';

interface Props {
  open: boolean;
  onClose: () => void;
  vehicle: Vehicle;
}

export const VehicleInformationModal = ({ open, onClose, vehicle }: Props) => {
  return (
    <Modal
      isOpen={open}
      onOpenChange={onClose}
      showFooter={false}
      header={
        <h2 className="uppercase font-thin">
          Unidad: <span className="font-bold">{vehicle.name}</span>
        </h2>
      }
      size="3xl"
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
        <Tab key="vehicle-form" title="Información">
          <VehicleForm onAfterSubmit={onClose} vehicle={vehicle} />
        </Tab>
        <Tab key="history-form" title="Actualizaciones">
          <HistoryChanges vehicle={vehicle}></HistoryChanges>
        </Tab>
        <Tab key="assignments-form" title="Asignaciones">
          <AssignmentsDriver vehicle={vehicle}></AssignmentsDriver>
        </Tab>
        <Tab key="posture-form" title="Posturas">
          <Posturas vehicle={vehicle} />
        </Tab>
      </Tabs>
    </Modal>
  );
};

