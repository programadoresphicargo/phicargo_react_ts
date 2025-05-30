import { Box } from '@mui/material';
import './style.css';
import logo from '../assets/logo_1.png';
import { Spinner } from '@heroui/react';

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
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>
      <div className="content">
        <img src={logo} width="370" height="200" />
        <Spinner classNames={{ label: "text-foreground mt-4" }} variant="wave" color='default' />
      </div>
    </Box>
  );
};
