import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button } from './Button';
import { ButtonProps } from '@mui/material';

interface Props extends ButtonProps {
  label: string;
}

/**
 * Custom button with an add icon
 */
export const AddButton = (props: Props) => {
  return (
    <Button
      color="primary"
      variant="outlined"
      size="small"
      startIcon={<AddCircleOutlineIcon />}
      {...props}
    >
      {props.label}
    </Button>
  );
};

