import { Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef } from 'react';

export const MuiTransition = forwardRef(function Transition(
  props: TransitionProps & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

