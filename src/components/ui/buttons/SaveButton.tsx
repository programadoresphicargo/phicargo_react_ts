import { Button, ButtonProps } from '@heroui/react';

import { FaRegSave } from "react-icons/fa";

export const SaveButton = (props: ButtonProps) => {
  return (
    <Button
      color="primary"
      size="sm"
      radius="full"
      startContent={<FaRegSave className="text-sm" />}
      {...props}
    >
      Guardar
    </Button>
  );
};

