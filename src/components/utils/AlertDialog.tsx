import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
} from '@heroui/react';

import { Alert } from '../ui';

interface Props {
  iconOnly?: boolean;
  customOkText?: string;
  customCancelText?: string;
  openButtonText?: string;
  buttonVariant?:
    | 'light'
    | 'solid'
    | 'bordered'
    | 'flat'
    | 'faded'
    | 'shadow'
    | 'ghost';
  openButtonIcon?: React.ReactNode;
  severity?:
    | 'success'
    | 'warning'
    | 'primary'
    | 'default'
    | 'secondary'
    | 'danger';
  title: string;
  message: string;
  onConfirm: () => void;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  openDisabled?: boolean;
  tooltipMessage?: string;
  withOpenButton?: boolean;
}

export const AlertDialog = (props: Props) => {
  const { withOpenButton = true } = props;

  const handleConfirm = () => {
    props.onConfirm();
    props.onOpenChange(false);
  };

  return (
    <>
      {withOpenButton && (
        <Tooltip content={props.tooltipMessage || 'Abrir'}>
          <Button
            color={props.severity || 'warning'}
            onPress={() => props.onOpenChange(true)}
            size="sm"
            variant={props.buttonVariant || 'light'}
            isIconOnly={props.iconOnly}
            isDisabled={props.openDisabled}
          >
            {props.iconOnly ? props.openButtonIcon : props.openButtonText}
          </Button>
        </Tooltip>
      )}
      <Modal
        isOpen={props.open}
        placement="top-center"
        onOpenChange={props.onOpenChange}
        classNames={{
          header: 'bg-gray-100 text-center p-2 uppercase',
          body: 'p-0',
          footer: 'bg-gray-100 p-2',
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold uppercase">
                  {props.title}
                </h3>
              </ModalHeader>
              <ModalBody>
                <Alert
                  color={props.severity || 'warning'}
                  title={props.message}
                />
              </ModalBody>
              <ModalFooter className="flex justify-between">
                <Button
                  color="default"
                  variant="light"
                  size="sm"
                  onPress={() => props.onOpenChange(false)}
                >
                  {props.customCancelText || 'Cancelar'}
                </Button>
                <Button
                  color={props.severity || 'warning'}
                  size="sm"
                  variant="flat"
                  className="font-bold"
                  radius="full"
                  onPress={handleConfirm}
                >
                  {props.customOkText || 'Aceptar'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

