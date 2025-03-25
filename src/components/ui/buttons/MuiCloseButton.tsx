import { IconButton, IconButtonProps } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

export const MuiCloseButton = (props: IconButtonProps) => {
  return (
    <IconButton
      aria-label="close"
      size="small"
      sx={(theme) => ({
        m: 0,
        color: theme.palette.grey[500],
      })}
      {...props}
    >
      <CloseIcon />
    </IconButton>
  );
};

