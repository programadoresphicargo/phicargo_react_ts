import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from '@mui/material';

import { MuiCloseButton } from '../ui';
import { MuiTransition } from './MuiTransition';
import { ReactNode } from 'react';

interface Props extends DialogProps {
  children: ReactNode;
  header: ReactNode;
  customFooter?: ReactNode;
  showFooter?: boolean;
}

export const MuiModal = (props: Props) => {

  const { showFooter = true } = props;

  return (
    <Dialog
      slots={{
        transition: MuiTransition,
      }}
      sx={{
        '& .MuiPaper-root': {
          borderRadius: 4,
        },
      }}
      disableEnforceFocus={true}
      disableScrollLock={true}
      {...props}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 15px',
          color: 'white',
          background: 'linear-gradient(90deg, #0b2149, #002887)',
          fontFamily: 'Inter',
          textAlign: 'center',
        }}
      >
        {props.header}
        <MuiCloseButton
          onClick={(event) => props.onClose?.(event, 'backdropClick')}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
          size="small"
          aria-label="close"
        />
      </DialogTitle>
      <DialogContent sx={{ padding: '0' }}>{props.children}</DialogContent>
      {showFooter && (
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: '#f3f4f6',
            textAlign: 'center',
            padding: '10px',
            borderTop: '1px solid',
            borderColor: '#e5e7eb',
          }}
        >
          {props.customFooter}
        </DialogActions>
      )}
    </Dialog>
  );
};

