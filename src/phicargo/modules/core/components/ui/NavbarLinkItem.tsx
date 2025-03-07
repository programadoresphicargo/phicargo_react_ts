import { Link } from '@heroui/react';
import { useLocation } from 'react-router-dom';

interface Props {
  name: string;
  path: string;
}

export const NavbarLinkItem = ({ name, path }: Props) => {
  const { pathname } = useLocation();

  return (
    <Link
      href={path}
      className={`px-4 py-2 rounded-md transition-all duration-300 ${
        pathname.includes(path)
          ? 'bg-gray-200/20 backdrop-blur-sm text-white text-medium shadow-md p-2 border-gray-500'
          : 'text-gray-300 hover:text-white text-medium p-2 hover:bg-gray-200/10 backdrop-blur-sm'
      }`}
    >
      {name}
    </Link>
  );
};

