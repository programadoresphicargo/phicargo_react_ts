import { Button } from './Button';
import { ButtonProps } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

export const MuiSaveButton = (props: ButtonProps) => {
  return (
    <Button color="primary" size="small" startIcon={<SaveIcon />} {...props}>
      Guardar
    </Button>
  );
};

