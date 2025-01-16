import {
  Button,
  Link,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUiNavbar,
} from '@nextui-org/react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AvatarProfile from './AvatarProfile';
import { NavbarLinkItem } from './NavbarLinkItem';
import { useState } from 'react';

type MenuItemType = {
  name: string;
  path: string;
};

interface Props {
  pages: MenuItemType[];
}

export const Navbar = (props: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { pages } = props;

  return (
    <NextUiNavbar
      maxWidth="full"
      height={'3.2rem'}
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      style={{
        background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 400"><rect width="1920" height="400" fill="%23D9DEEA" /><mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="400"><rect width="1920" height="400" fill="%23D9DEEA" /></mask><g mask="url(%23mask0)"><path d="M1059.48 308.024C1152.75 57.0319 927.003 -103.239 802.47 -152.001L1805.22 -495.637L2095.53 351.501L1321.23 616.846C1195.12 618.485 966.213 559.015 1059.48 308.024Z" fill="%23C0CBDD" /><path d="M1333.22 220.032C1468.66 -144.445 1140.84 -377.182 960 -447.991L2416.14 -947L2837.71 283.168L1713.32 668.487C1530.19 670.868 1197.78 584.509 1333.22 220.032Z" fill="%238192B0" /></g></svg>')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <img
            className="ml-4"
            src="https://phi-cargo.com/wp-content/uploads/2021/05/logo-phicargo-vertical.png"
            alt="logo phicargo"
            style={{
              height: '50px',
            }}
          />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <Button
          isIconOnly
          aria-label="back"
          size='sm'
          as={Link}
          href="/menu"
          className="bg-gray-100 rounded-full p-2 shadow-md hover:bg-gray-200 transition"
        >
          <ArrowBackIcon />
        </Button>
        <NavbarBrand>
          <img
            className="ml-4"
            src="https://phi-cargo.com/wp-content/uploads/2021/05/logo-phicargo-vertical.png"
            alt="logo phicargo"
            style={{
              height: '50px',
            }}
          />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {pages.map((page, i) => (
          <NavbarItem key={i}>
            <NavbarLinkItem name={page.name} path={page.path} />
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <AvatarProfile />
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem>
          <Link className="w-full" href="control-usuarios/usuarios" size="lg">
            {'Usuarios'}
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </NextUiNavbar>
  );
};

