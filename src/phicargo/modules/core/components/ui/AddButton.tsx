import { Button, ButtonProps } from "@heroui/react";

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ReactNode } from 'react';

interface AddButtonProps extends ButtonProps {
  label: ReactNode;
}

/**
 * Custom button with an add icon
 */
const AddButton = (props: AddButtonProps) => {
  return (
    <Button
      color="primary"
      variant="faded"
      className="font-bold px-2"
      startContent={<AddCircleOutlineIcon width={'1.5em'} height={'1.5em'} />}
      {...props}
    >
      {props.label}
    </Button>
  );
};

export default AddButton;
