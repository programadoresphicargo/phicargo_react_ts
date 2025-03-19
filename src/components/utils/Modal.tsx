import {
  Button,
  Modal as HeroModal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from '@heroui/react';

import { ReactNode } from 'react';

interface Props extends ModalProps {
  children: ReactNode;
  header: ReactNode;
  showFooter?: boolean;
  customFooter?: ReactNode;
}

export const Modal = (props: Props) => {

  const { showFooter = true } = props;

  return (
    <>
      <HeroModal
        scrollBehavior="inside"
        backdrop="opaque"
        classNames={{
          body: 'bg-gray-200 p-0 gap-0',
          backdrop: 'bg-gray-500/30 backdrop-opacity-30',
          base: 'text-gray-900 shadow-lg',
          header:
            'bg-gradient-to-b from-[#0b2149] to-[#002887] text-gray-200 px-4 py-3 rounded-t-xl',
          footer: 'border-t border-gray-300 bg-gray-200 py-3 px-4 rounded-b-xl',
          closeButton:
            'hover:bg-gray-200/10 backdrop-blur-sm text-gray-300 hover:text-white',
        }}
        {...props}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{props.header}</ModalHeader>
              <ModalBody>{props.children}</ModalBody>
              {showFooter && (
                <ModalFooter className="flex justify-between">
                  <Button
                    color="default"
                    variant="light"
                    size="sm"
                    onPress={onClose}
                  >
                    Cerrar
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    variant="flat"
                    className="font-bold"
                    radius="full"
                    onPress={onClose}
                  >
                    OK
                  </Button>
                </ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </HeroModal>
    </>
  );
};

