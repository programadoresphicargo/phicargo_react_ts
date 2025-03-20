import { IconButton, Tooltip } from '@mui/material';

import RefreshIcon from '@mui/icons-material/Refresh';

interface Props {
  onRefresh: () => void;
  isLoading?: boolean;
  customTitle?: string;
}

export const RefreshButton = ({ onRefresh, isLoading, customTitle }: Props) => {
  return (
    <Tooltip arrow title={customTitle || 'Recargar'}>
      <IconButton size="small" onClick={onRefresh} disabled={isLoading}>
        <RefreshIcon
          sx={{ color: 'linear-gradient(90deg, #0b2149, #002887)' }}
        />
      </IconButton>
    </Tooltip>
  );
};

