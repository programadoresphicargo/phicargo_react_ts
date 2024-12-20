import { ReactNode } from 'react';

interface Props {
  title: string;
  alert?: boolean;
  content: string | number | ReactNode;
}

export const HeaderCard = (props: Props) => {
  return (
    <div className="bg-gray-700 rounded-lg p-2 shadow-md max-w-xs flex-1 transition-transform transform hover:scale-105 hover:shadow-lg">
      <p className="text-gray-300 text-center font-bold text-base m-0">
        {props.title}
      </p>
      <hr className="border-t border-gray-600 my-1" />
      <p className="text-emerald-400 text-center font-bold text-2xl m-0 transition-colors duration-300">
        {props.content}
      </p>
    </div>
  );
};

