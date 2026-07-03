import {
  Button,
  Tooltip,
} from '@heroui/react';
import { Alert } from '../ui';
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@mui/material';

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
      <Dialog
        open={props.open}
        onClose={props.onOpenChange}
      >
        <DialogTitle
          style={{
            background: 'linear-gradient(70deg, #004494, #002887)',
            color: 'white',
            fontWeight: 'bold',
            fontFamily: 'Inter'
          }}>
          {props.title}
        </DialogTitle>
        <Divider></Divider>
        <DialogContent>
          <>
            <Alert
              color={props.severity || 'warning'}
              title={props.message}
            />
            <DialogActions className="flex justify-between">
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
            </DialogActions>
          </>
        </DialogContent>
      </Dialog>
    </>
  );
};

