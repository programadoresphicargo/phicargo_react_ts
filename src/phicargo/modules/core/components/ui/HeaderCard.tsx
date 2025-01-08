import { IoMdInformationCircle } from 'react-icons/io';
import { ReactNode } from 'react';

interface Props {
  title: string;
  alert?: boolean;
  content: string | number | ReactNode;

  infoButton?: boolean;
  infoButtonIcon?: ReactNode;
  onInfoClick?: () => void;
}

export const HeaderCard = (props: Props) => {
  return (
    <div className="bg-gray-700 rounded-lg p-2 shadow-md max-w-xs flex-1 hover:shadow-xl relative">

      {props.infoButton && (
        <button
          onClick={props.onInfoClick || (() => {})}
          className="absolute top-2 right-2 text-emerald-400 hover:text-emerald-500"
        >
          {props.infoButtonIcon || <IoMdInformationCircle className="w-5 h-5" />}
        </button>
      )}

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

