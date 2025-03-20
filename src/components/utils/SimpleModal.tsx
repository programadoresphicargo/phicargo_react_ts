import {
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
  customFooter?: ReactNode;
}

export const SimpleModal = (props: Props) => {
  return (
    <>
      <HeroModal
        scrollBehavior="inside"
        classNames={{
          header: 'bg-gray-100 uppercase p-2 rounded-t-xl border-b border-gray-200 text-center',
          footer: 'bg-gray-100 text-center p-2 rounded-b-xl border-t border-gray-200',
          body: 'px-2',
        }}
        {...props}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>{props.header}</ModalHeader>
              <ModalBody>{props.children}</ModalBody>
              <ModalFooter className="flex justify-between">
                {props.customFooter}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </HeroModal>
    </>
  );
};

