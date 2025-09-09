import {
  Link,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUiNavbar,
} from '@heroui/react';
import { useMemo, useState } from 'react';

import AvatarProfile from '../AvatarProfile';
import { BackButton } from '@/components/ui';
import type { MenuItemType } from '@/types';
import { NavbarLinkItem } from './NavbarLinkItem';
import { useAuthContext } from '@/modules/auth/hooks';
import logo from '../../../assets/img/phicargo-vertical.png';

interface Props {
  pages: MenuItemType[];
}

export const Navbar = (props: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { session } = useAuthContext();

  const { pages } = props;

  const filteredMenuItems = useMemo(
    () =>
      pages.filter((item) =>
        item.requiredPermissions.every((permission) =>
          session?.user?.permissions?.includes(permission),
        ),
      ),
    [pages, session?.user?.permissions],
  );

  return (
    <NextUiNavbar
      maxWidth="full"
      height={'3.2rem'}
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      style={{
        // background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 400"><rect width="1920" height="400" fill="%23D9DEEA" /><mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="400"><rect width="1920" height="400" fill="%23D9DEEA" /></mask><g mask="url(%23mask0)"><path d="M1059.48 308.024C1152.75 57.0319 927.003 -103.239 802.47 -152.001L1805.22 -495.637L2095.53 351.501L1321.23 616.846C1195.12 618.485 966.213 559.015 1059.48 308.024Z" fill="%23C0CBDD" /><path d="M1333.22 220.032C1468.66 -144.445 1140.84 -377.182 960 -447.991L2416.14 -947L2837.71 283.168L1713.32 668.487C1530.19 670.868 1197.78 584.509 1333.22 220.032Z" fill="%238192B0" /></g></svg>')`,
        // backgroundSize: 'cover',
        // backgroundPosition: 'center',
        background: 'linear-gradient(90deg, #002887 0%, #0059b3 100%)',
      }}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <BackButton route="/menu" />
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className='text-white'
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <img
            src={logo}
            alt="logo phicargo"
            // style={{
            //   height: '50px',
            //   filter: 'brightness(0) invert(1)'
            // }}
            className="ml-4 h-12 filter brightness-0 invert"
          />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <BackButton route="/menu" />
        <NavbarBrand>
          <img
            className="ml-4 h-12 filter brightness-0 invert"
            src={logo}
            alt="logo phicargo"
          />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {filteredMenuItems.map((page, i) => (
          <NavbarItem key={i}>
            <NavbarLinkItem
              name={page.name}
              path={page.path}
              exact={page.exact}
            />
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <AvatarProfile />
      </NavbarContent>

      <NavbarMenu>
        {filteredMenuItems.map((page, i) => (
          <NavbarMenuItem key={i}>
            <Link 
              className="w-full" 
              href={page.path}
              size="lg"
            >
              {page.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NextUiNavbar>
  );
};

