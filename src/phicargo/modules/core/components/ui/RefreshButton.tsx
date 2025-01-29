import { IconButton, Tooltip } from '@mui/material';

import { CSSProperties } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Props {
  onClick: () => void;
  customIcon?: React.ReactNode;
  isLoading?: boolean;
  customTooltip?: string;
  className?: string;
  buttonClassName?: string;
  style?: CSSProperties;
}

export const RefreshButton = (props: Props) => {
  const {
    onClick,
    className,
    style,
    customIcon,
    buttonClassName,
    customTooltip,
    isLoading,
  } = props;

  return (
    <Tooltip arrow title={customTooltip || 'Refrescar'}>
      <IconButton
        onClick={onClick || (() => {})}
        className={className}
        style={style}
        disabled={isLoading}
      >
        {customIcon || <RefreshIcon className={buttonClassName} />}
      </IconButton>
    </Tooltip>
  );
};

