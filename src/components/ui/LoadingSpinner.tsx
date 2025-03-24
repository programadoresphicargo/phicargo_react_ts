import { Spinner, SpinnerProps } from '@heroui/react';

export const LoadingSpinner = (props: SpinnerProps) => {
  return (
    <div className="flex items-center justify-center h-full">
      <Spinner
        classNames={{
          label: 'text-gray-700 uppercase',
        }}
        variant="wave"
        color="primary"
        size="lg"
        {...props}
      />
    </div>
  );
};

