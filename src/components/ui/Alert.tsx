import { AlertProps, Alert as HeroAlert } from '@heroui/react';

export const Alert = (props: AlertProps) => {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex flex-col w-full">
        <div className="w-full flex items-center my-3">
          <HeroAlert {...props} />
        </div>
      </div>
    </div>
  );
};

