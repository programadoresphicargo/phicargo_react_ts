import { IoMdInformationCircle } from 'react-icons/io';
import { ReactNode } from 'react';

type ClassNames = {
  title?: string;
  content?: string;
};

interface Props {
  title: string;
  alert?: boolean;
  content: string | number | ReactNode;
  isLoading?: boolean;

  classNames?: ClassNames;

  startContent?: string | number | ReactNode;

  infoButton?: boolean;
  infoButtonIcon?: ReactNode;
  onInfoClick?: () => void;
}

export const HeaderCard = (props: Props) => {
  return (
    <div className="bg-gray-700 rounded-lg p-1 shadow-md max-w-xs flex-1 hover:shadow-xl relative">
      {props.startContent && (
        <div className="absolute top-2 left-2">{props.startContent}</div>
      )}

      <p
        className={
          props.classNames?.title ||
          'text-gray-300 text-center font-bold text-base m-0'
        }
      >
        {props.title}
      </p>

      {props.infoButton && (
        <button
          onClick={props.onInfoClick || (() => {})}
          className="absolute top-2 right-2 text-emerald-400 hover:text-emerald-500"
        >
          {props.infoButtonIcon || (
            <IoMdInformationCircle className="w-5 h-5" />
          )}
        </button>
      )}
      <hr className="border-t border-gray-600 my-1" />
      {props.isLoading ? (
        <div className="animate-pulse bg-gray-600 h-8 rounded-lg"></div>
      ) : (
        <p
          className={
            props.classNames?.content ||
            'text-emerald-400 text-center font-bold text-2xl m-0 transition-colors duration-300'
          }
        >
          {props.content}
        </p>
      )}
    </div>
  );
};

