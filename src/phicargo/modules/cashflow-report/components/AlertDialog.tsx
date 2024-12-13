import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';

import { IoIosAlert } from 'react-icons/io';

interface AlertDialogProps {
  alert: string;
  description?: string;
  onConfirm: () => void;
  onClose: () => void;
}

const AlertDialog = (props: AlertDialogProps) => {
  const { onClose, onConfirm, alert, description } = props;

  return (
    <>
      <Modal isOpen={true} size={'sm'} onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex items-center gap-2 pb-2 bg-[#dadfeb]">
                <IoIosAlert className="text-4xl text-yellow-500" />
                <h3 className="font-bold text-xl text-gray-800 uppercase">
                  {alert}
                </h3>
              </ModalHeader>
              <ModalBody>
                <p>{description || "¿Seguro de completar esta acción?"}</p>
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="warning" 
                  onPress={onConfirm}
                  size="sm"
                  className='uppercase font-bold text-gray-800'
                >
                  Completar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AlertDialog;
