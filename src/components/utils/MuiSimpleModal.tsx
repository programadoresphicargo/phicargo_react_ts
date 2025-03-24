import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from '@mui/material';

import { MuiTransition } from './MuiTransition';
import { ReactNode } from 'react';

interface Props extends DialogProps {
  children: ReactNode;
  header: ReactNode;
  customFooter?: ReactNode;
}

export const MuiSimpleModal = (props: Props) => {
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
      {...props}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#f3f4f6',
          textTransform: 'uppercase',
          padding: '10px',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          borderBottom: '1px solid',
          borderColor: '#e5e7eb',
          fontFamily: 'Inter',
          textAlign: 'center',
        }}
      >
        {props.header}
      </DialogTitle>
      <DialogContent sx={{ padding: '0' }}>{props.children}</DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: '#f3f4f6',
          textAlign: 'center',
          padding: '10px',
          borderTop: '1px solid',
          borderColor: '#e5e7eb',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
        }}
      >
        {props.customFooter}
      </DialogActions>
    </Dialog>
  );
};

