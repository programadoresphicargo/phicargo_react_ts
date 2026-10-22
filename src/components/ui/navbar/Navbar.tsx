
import {
  Link,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUiNavbar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@heroui/react';

import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import AvatarProfile from '../AvatarProfile';
import { BackButton } from '@/components/ui';
import type { MenuItemType } from '@/types';
import { NavbarLinkItem } from './NavbarLinkItem';
import { useAuthContext } from '@/modules/auth/hooks';
import logo from '../../../assets/img/phicargo-vertical.png';

interface Props {
  pages: MenuItemType[];
}

const MAX_VISIBLE_ITEMS = 7;

export const Navbar = ({ pages }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { session } = useAuthContext();

  const filteredMenuItems = useMemo(
    () =>
      pages.filter((item) =>
        item.requiredPermissions.every((permission) =>
          session?.user?.permissions?.includes(permission),
        ),
      ),
    [pages, session?.user?.permissions],
  );

  const visibleItems = filteredMenuItems.slice(0, MAX_VISIBLE_ITEMS);
  const extraItems = filteredMenuItems.slice(MAX_VISIBLE_ITEMS);

  return (
    <NextUiNavbar
      maxWidth="full"
      height="3.5rem"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        base: 'bg-gradient-to-r from-[#002887] to-[#0059b3]',
        wrapper: 'px-3 sm:px-5 gap-2',
        item: 'text-white',
        menu: 'bg-[#002887]',
      }}
    >
      {/* Navegación móvil */}
      <NavbarContent className="sm:hidden" justify="start">
        <BackButton route="/menu" />
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          className="text-white"
        />
      </NavbarContent>

      {/* Logo móvil */}
      <NavbarContent className="sm:hidden" justify="center">
        <NavbarBrand className="justify-center">
          <img
            src={logo}
            alt="PhiCargo"
            className="h-9 w-auto brightness-0 invert"
          />
        </NavbarBrand>
      </NavbarContent>

      {/* Logo escritorio */}
      <NavbarContent className="hidden sm:flex flex-none" justify="start">
        <BackButton route="/menu" />
        <NavbarBrand className="ml-1">
          <img
            src={logo}
            alt="PhiCargo"
            className="h-9 w-auto brightness-0 invert"
          />
        </NavbarBrand>
      </NavbarContent>

      {/* Enlaces principales: cantidad limitada */}
      <NavbarContent
        className="hidden sm:flex flex-1 min-w-0 justify-center gap-1"
        justify="center"
      >
        {visibleItems.map((page) => (
          <NavbarItem key={page.path} className="shrink-0">
            <NavbarLinkItem
              name={page.name}
              path={page.path}
              exact={page.exact}
            />
          </NavbarItem>
        ))}

        {/* Resto de las opciones */}
        {extraItems.length > 0 && (
          <NavbarItem className="shrink-0">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  variant="light"
                  size="sm"
                  className="text-white min-w-0 px-3 font-medium"
                  endContent={<ChevronDown size={15} />}
                >
                  Más
                </Button>
              </DropdownTrigger>

              <DropdownMenu
                aria-label="Más opciones de navegación"
                className="max-h-[70vh] overflow-y-auto"
                onAction={(key) => {
                  const selected = extraItems.find(
                    (item) => item.path === String(key),
                  );

                  if (selected) {
                    window.location.href = selected.path;
                  }
                }}
              >
                {extraItems.map((page) => (
                  <DropdownItem
                    key={page.path}
                    textValue={page.name}
                  >
                    {page.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        )}
      </NavbarContent>

      {/* Perfil siempre separado */}
      <NavbarContent
        justify="end"
        className="flex-none"
      >
        <AvatarProfile />
      </NavbarContent>

      {/* Menú móvil con todas las opciones */}
      <NavbarMenu className="bg-[#002887] pt-4">
        {filteredMenuItems.map((page) => (
          <NavbarMenuItem key={page.path}>
            <Link
              className="w-full text-white py-2"
              href={page.path}
              size="lg"
              onPress={() => setIsMenuOpen(false)}
            >
              {page.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NextUiNavbar>
  );
};
