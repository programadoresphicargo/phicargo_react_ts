import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';
import logo from '../assets/img/phicargo-logo-color.png';

const floatAnimation = keyframes`
  0% { transform: translateY(0) scale(1) rotate(-5deg); }
  25% { transform: translateY(-25px) scale(1.05) rotate(0deg); }
  50% { transform: translateY(10px) scale(1.03) rotate(5deg); }
  75% { transform: translateY(-15px) scale(1.07) rotate(-3deg); }
  100% { transform: translateY(0) scale(1) rotate(-5deg); }
`;

const gradientBackground = keyframes`
  0% { 
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 50%, #d1d8e0 100%); 
    background-size: 400% 400%; 
  }
  50% { 
    background: linear-gradient(225deg, #e4e8f0 0%, #f5f7fa 50%, #e4e8f0 100%); 
    background-size: 400% 400%; 
  }
  100% { 
    background: linear-gradient(315deg, #d1d8e0 0%, #e4e8f0 50%, #f5f7fa 100%); 
    background-size: 400% 400%; 
  }
`;

const pulseShadow = keyframes`
  0% { 
    filter: drop-shadow(0 5px 15px rgba(0, 40, 135, 0.4));
  }
  50% { 
    filter: drop-shadow(0 15px 30px rgba(0, 40, 135, 0.7)) 
           drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
  }
  100% { 
    filter: drop-shadow(0 5px 15px rgba(0, 40, 135, 0.4));
  }
`;

const particleAnimation = keyframes`
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
`;

export const LoadingPage = () => {

  const particles = Array.from({ length: 20 }).map((_, i) => (
    <Box
      key={i}
      sx={{
        position: 'absolute',
        bottom: 0,
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 4 + 2}px`,
        height: `${Math.random() * 4 + 2}px`,
        backgroundColor: '#0b2149',
        borderRadius: '50%',
        animation: `${particleAnimation} ${Math.random() * 5 + 5}s linear infinite`,
        animationDelay: `${Math.random() * 3}s`,
        opacity: 0,
      }}
    />
  ));

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        animation: `${gradientBackground} 12s ease infinite`,
        overflow: 'hidden',
      }}
    >
      {particles}
      
      <Box
        sx={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          animation: `${floatAnimation} 15s ease infinite alternate`,
          opacity: 0.5,
        }}
      />
    
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: 3,
          borderRadius: 2,
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="Logo Phi Cargo"
          sx={{
            width: { xs: '200px', sm: '280px' },
            maxWidth: '80vw',
            height: 'auto',
            animation: `${floatAnimation} 4s ease-in-out infinite, ${pulseShadow} 6s ease infinite`,
            transformOrigin: 'center center',
            transition: 'all 0.3s ease',
            '&:hover': {
              animationPlayState: 'paused',
              transform: 'scale(1.1)',
            },
          }}
        />
      </Box>
    </Box>
  );
};