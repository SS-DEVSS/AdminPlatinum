import { ReactNode } from "react";
import { Card } from "./ui/card";

type NoDataProps = {
  children: ReactNode;
};

const NoData = ({ children }: NoDataProps) => {
  return (
    <Card className="flex flex-col flex-grow gap-2 items-center justify-center py-10 h-full">
      {children}
    </Card>
  );
};

export default NoData;
