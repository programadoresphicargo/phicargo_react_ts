import { IncidenceForm } from './IncidenceForm';
import { SaveButton } from '@/components/ui';
import { SimpleModal } from '@/components';
import { useState } from 'react';

interface Props {
  driverId: number;
  isOpen: boolean;
  onOpenChange: () => void;
}

export const IncidenceCreateModal = (props: Props) => {
  const { driverId, isOpen, onOpenChange } = props;

  const [submitForm, setSubmitForm] = useState<(() => void) | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <SimpleModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      header={<h2 className="w-full">Agregar Incidencia</h2>}
      customFooter={
        <SaveButton
          onPress={() => submitForm && submitForm()}
          fullWidth
          variant="flat"
          className="font-bold uppercase"
          isLoading={isLoading}
        />
      }
    >
      <IncidenceForm
        driverId={driverId}
        setSubmit={setSubmitForm}
        setIsLoading={setIsLoading}
        onSuccessfulSubmit={onOpenChange}
      />
    </SimpleModal>
  );
};
