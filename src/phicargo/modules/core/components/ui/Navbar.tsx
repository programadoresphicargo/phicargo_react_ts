import { IconButton, Link } from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AvatarProfile from './AvatarProfile';
import Box from '@mui/material/Box';
import { Button } from '@nextui-org/react';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import { useState } from 'react';

type MenuItemType = {
  name: string;
  path: string;
};

interface Props {
  pages: MenuItemType[];
}

const Navbar = (props: Props) => {
  const { pages } = props;

  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const { pathname } = useLocation();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 400"><rect width="1920" height="400" fill="%23D9DEEA" /><mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="400"><rect width="1920" height="400" fill="%23D9DEEA" /></mask><g mask="url(%23mask0)"><path d="M1059.48 308.024C1152.75 57.0319 927.003 -103.239 802.47 -152.001L1805.22 -495.637L2095.53 351.501L1321.23 616.846C1195.12 618.485 966.213 559.015 1059.48 308.024Z" fill="%23C0CBDD" /><path d="M1333.22 220.032C1468.66 -144.445 1140.84 -377.182 960 -447.991L2416.14 -947L2837.71 283.168L1713.32 668.487C1530.19 670.868 1197.78 584.509 1333.22 220.032Z" fill="%238192B0" /></g></svg>')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-full px-4 text-white flex flex-col">
        <Toolbar disableGutters>
          <Button
            isIconOnly
            aria-label="back"
            onPress={() => navigate('/menu')}
            className="bg-gray-100 rounded-full p-2 shadow-md hover:bg-gray-200 transition"
          >
            <ArrowBackIcon />
          </Button>

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Link component={RouterLink} to={page.path}>
                    {page.name}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <img
            className="ml-4"
            src="https://phi-cargo.com/wp-content/uploads/2021/05/logo-phicargo-vertical.png"
            alt="logo phicargo"
            style={{
              width: '175px',
              height: '60px',
            }}
          />

          {/* Desktop version */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              gap: 2,
              justifyContent: 'center',
            }}
          >
            {pages.map((page) => {
              const isActive = pathname.includes(page.path);

              return (
                <Link
                  key={page.name}
                  component={RouterLink}
                  to={page.path}
                  sx={{
                    fontSize: '1rem',
                    fontFamily: 'Inter',
                    fontWeight: isActive ? '700' : '500',
                    textTransform: 'uppercase',
                    color: isActive ? '#fff' : '#333333',
                    textDecoration: 'none',
                    position: 'relative',
                    padding: '0.3rem 1.3rem',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    backgroundColor: isActive ? '#222222' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#fff',
                      color: '#222222',
                    },
                  }}
                >
                  {page.name}
                </Link>
              );
            })}
          </Box>

          <div className="ml-auto">
            <AvatarProfile />
          </div>
        </Toolbar>
      </div>
    </AppBar>
  );
};

export default Navbar;

