import { ReactNode } from 'react';

interface Props {
  title: string;
  alert?: boolean;
  content: string | number | ReactNode;
}

/**
 * Custom card para indicadores de recaudación
 */
const Card = (props: Props) => {
  return (
    <div className="bg-gray-200/20 backdrop-blur-sm rounded-lg p-2 shadow-md max-w-xs flex-1 hover:shadow-lg transition-shadow duration-300">
      <p className="text-gray-200 text-center font-bold uppercase text-sm m-0">
        {props.title}
      </p>
      <hr className="border-t border-gray-300 my-1" />
      <p className="text-lime-400 text-center font-bold text-lg m-0 transition-colors duration-300">
        {props.content}
      </p>
    </div>
  );
};

export default Card;
