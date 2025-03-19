import { Box } from '@mui/material';
import { ThreeDots } from '@agney/react-loading';

export const LoadingPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 165px)',
      }}
    >
      <ThreeDots
        // @ts-expect-error no hay tipos
        width="80"
        height="80"
      />
    </Box>
  );
};
