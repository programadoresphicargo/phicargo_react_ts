import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { usePageStore } from '../../hooks/useStore';

const Navbar = () => {

  const { page, changePage } = usePageStore();

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component="nav" sx={{ bgcolor: 'gray' }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Phicargo
          </Typography>

          <Box sx={{
            gap: 2, 
            display: { 
              xs: 'none', 
              md: 'flex' 
            } 
          }}>
            <Chip 
              label="OPERADORES" 
              color={page === 'drivers' ? 'primary' : 'default'} 
              variant="filled"
              onClick={() => changePage('drivers')}
            />
            <Chip 
              label="DISPOINIBILIDAD" 
              color={page === 'availability' ? 'primary' : 'default'} 
              variant="filled"
              onClick={() => changePage('availability')}
            />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
