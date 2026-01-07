import { Link } from "react-router-dom";
import { useState } from "react";
import logo from '../assets/img/phicargo-vertical.png';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import AvatarProfile from "@/components/ui/AvatarProfile";
import { useAuthContext } from "@/modules/auth/hooks";
import GoogleAppsMenu from "./menu";

function SubMenu({ title, items }: any) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        sx={{ my: 2, color: "white", fontFamily: "inter", fontSize: "12px" }}
        onClick={(e: any) => setAnchorEl(e.currentTarget)}
      >
        {title}
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        {items?.map((item: any) => (
          <MenuItem
            key={item.name}
            component={Link}
            to={item.path}
            onClick={() => setAnchorEl(null)}
          >
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

const CustomNavbar = ({
  pages,
  extraButtons,
  rightComponents,
  showBackButton = true,
}: any) => {
  const { session } = useAuthContext();

  const [anchorElNav, setAnchorElNav] = useState(null);

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "linear-gradient(90deg, #002887 0%, #0059b3 100%)",
          padding: "0 16px",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>

            {/* Botón de regreso */}
            {showBackButton && (
              <GoogleAppsMenu></GoogleAppsMenu>
            )}

            <img
              src={logo}
              alt="Logo"
              style={{
                width: "175px",
                height: "60px",
                marginRight: "16px",
                filter: "brightness(0) invert(1)",
              }}
            />

            {/* Menú móvil */}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                color="inherit"
                onClick={(e: any) => setAnchorElNav(e.currentTarget)}
              >
                <MenuIcon />
              </IconButton>

              <Menu
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={() => setAnchorElNav(null)}
              >
                {pages?.map((p: any) => (
                  <MenuItem key={p.name} onClick={() => setAnchorElNav(null)}>
                    <Link
                      to={p.path || ""}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      {p.name}
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Menú escritorio */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages?.map((p: any) => {
                if (p.permiso && !session?.user?.permissions?.includes(p.permiso))
                  return null;

                if (p.subpages)
                  return <SubMenu key={p.name} title={p.name} items={p.subpages} />;

                return (
                  <Button
                    key={p.name}
                    component={Link}
                    to={p.path || ""}
                    sx={{ my: 2, color: "white", fontFamily: "inter", fontSize: "12px" }}
                  >
                    {p.name}
                  </Button>
                );
              })}
            </Box>

            {/* Botones adicionales opcionales */}
            {extraButtons && (
              <Box sx={{ display: "flex", marginRight: 2 }}>{extraButtons}</Box>
            )}

            {/* Avatar del usuario */}
            <AvatarProfile />
          </Toolbar>
        </Container>
      </AppBar>

      {/* Componentes extra (modal, panel, dialogs) */}
      {rightComponents}
    </>
  );
};

export default CustomNavbar;
