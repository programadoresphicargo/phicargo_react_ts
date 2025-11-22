import logo from '../assets/img/phicargo_logo_white.png';
import Toolbar from '@mui/material/Toolbar';
import AvatarProfile from '@/components/ui/AvatarProfile';
import AppBar from '@mui/material/AppBar';
import { Grid } from '@mui/system';
import { useAuthContext } from '@/modules/auth/hooks';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import fondo2 from '../assets/img/tract_scannia.jpg';
import { menuItems } from '../pages/MenuItems';

const MainMenuPage = () => {
  const { session } = useAuthContext();

  const filteredMenuItems = useMemo(
    () =>
      menuItems.filter((item) =>
        item.requiredPermissions.some((permission) =>
          session?.user?.permissions?.includes(permission),
        ),
      ),
    [session],
  );

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.05, // tiempo entre cada item (en segundos)
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  //linear-gradient(90deg, rgba(11, 33, 73, 0.95), rgba(0, 40, 135, 0.95)),

  return (
    <main
      style={{
        backgroundImage: `
        linear-gradient(90deg, rgba(100, 10, 10, 1), rgba(154, 44, 44, .90)),
        url(${fondo2})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <AppBar
        position="static"
        style={{
          backgroundColor: 'transparent',
          padding: '0',
          boxShadow: 'none',
        }}
        elevation={0}
      >
        <Toolbar>
          <Grid sx={{ flexGrow: 1 }}></Grid>
          <AvatarProfile />
        </Toolbar>
      </AppBar>
      <div
        className="flex items-center justify-center"
        style={{ minHeight: '25vh' }}
      >
        <div className="flex justify-center items-center">
          <img
            src={logo}
            alt="Logo Phi Cargo"
            className="w-72 sm:w-60 md:w-80 lg:w-[350px] h-auto object-contain"
          />
        </div>
      </div>

      <motion.div
        className="grid-container"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {filteredMenuItems.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            style={{
              padding: "10px",
              borderRadius: "20px",
              display: "flex",             // ✅ Activa flex
              justifyContent: "center",    // ✅ Centra horizontalmente
              alignItems: "center",        // ✅ Centra verticalmente
            }}
          >
            <MenuItem
              key={index}
              icon={item.icon}
              label={item.label}
              link={item.link}
            />
          </motion.div>
        ))}
      </motion.div>

    </main >
  );
};

export default MainMenuPage;

interface MenuItemProps {
  icon: string;
  label: string;
  link: string;
}

const MenuItem = ({ icon, label, link, }: MenuItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(link);
  };

  return (
    <div
      onClick={handleClick}
      className="
      flex
      flex-col
      items-center
      justify-center
      w-32
      h-32
      rounded-3xl
      bg-white/10
      shadow-xl
      backdrop-blur-lg
      border
      border-white/10
      cursor-pointer
      transition
      duration-300
      hover:bg-white/20
      hover:shadow-2xl
    "
    >
      <div className="mb-2.5">
        <img src={icon} alt={label} className="w-20 h-20 mb-1.5" />
      </div>
      <div className="text-xs font-bold text-white text-center">{label}</div>
    </div>
  );
};

