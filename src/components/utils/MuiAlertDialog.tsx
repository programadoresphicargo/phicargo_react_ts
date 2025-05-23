import { Alert, AlertTitle, Dialog, DialogContent } from '@mui/material';
import { Button, MuiCloseButton } from '../ui/buttons';
import { Box } from '@mui/system';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmButtonText?: string;
  title: string;
  message: string;
  severity?: 'success' | 'warning' | 'error' | 'info';
}

export const MuiAlertDialog = ({
  open,
  onClose,
  onConfirm,
  confirmButtonText = 'Confirmar',
  title,
  message,
  severity,
}: Props) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={`alert-dialog-${title}`}
      aria-describedby={`alert-dialog-description-${title}`}
      sx={{
        '.MuiDialogContent-root': {
          padding: 1,
        },
        '& .MuiPaper-root': {
          borderRadius: 4,
        },
      }}
    >
      <DialogContent>
        <Alert
          severity={severity}
          onClose={onClose}
          action={
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                height: '100%',
              }}
            >
              <Button
                onClick={onConfirm}
                color="inherit"
                size="small"
                variant="outlined"
              >
                {confirmButtonText}
              </Button>
              <MuiCloseButton
                onClick={onClose}
                aria-label="close"
                color="inherit"
                size="small"
              />
            </Box>
          }
        >
          <AlertTitle>{title}</AlertTitle>
          {message}
        </Alert>
      </DialogContent>
    </Dialog>
  );
};

