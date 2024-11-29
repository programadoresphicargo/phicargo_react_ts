import { Card, CardBody, CardHeader } from '@nextui-org/react';

import { ReactNode } from 'react';

interface Props {
  title: string;
  count: number;
  children?: ReactNode;
}

const NotAssignedCard = (props: Props) => {
  const { title, count, children } = props;

  return (
    <Card className="max-w-full">
      <CardHeader className="bg-gray-400 flex content-center items-center justify-between px-4">
        <div className="flex items-center content-center ">
          <h3 className="font-bold text-center uppercase ">{title}</h3>
        </div>
        <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white font-bold rounded-full shadow-md">
          {count}
        </div>
      </CardHeader>

      <CardBody
        style={{
          maxHeight: `calc(100vh - 180px)`,
          overflowY: 'auto',
        }}
      >
        <div className="space-y-4">{children}</div>
      </CardBody>
    </Card>
  );
};

export default NotAssignedCard;

