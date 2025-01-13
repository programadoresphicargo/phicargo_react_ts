import { Link } from '@nextui-org/react';
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
          ? 'bg-gray-900 text-white shadow-md border-b-2 border-blue-500'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {name}
    </Link>
  );
};
