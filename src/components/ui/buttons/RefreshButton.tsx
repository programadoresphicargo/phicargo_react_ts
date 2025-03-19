import { IconButton, Tooltip } from '@mui/material';

import RefreshIcon from '@mui/icons-material/Refresh';

interface Props {
  onRefresh: () => void;
  isLoading?: boolean;
}

export const RefreshButton = ({ onRefresh, isLoading }: Props) => {
  return (
    <Tooltip arrow title="Refrescar">
      <IconButton size="small" onClick={onRefresh} disabled={isLoading}>
        <RefreshIcon
          sx={{ color: 'linear-gradient(90deg, #0b2149, #002887)' }}
        />
      </IconButton>
    </Tooltip>
  );
};

