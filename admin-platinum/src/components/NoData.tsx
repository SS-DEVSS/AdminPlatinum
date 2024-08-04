import { ReactNode } from "react";
import { Card } from "./ui/card";

type NoDataProps = {
  children: ReactNode;
};

const NoData = ({ children }: NoDataProps) => {
  return (
    <Card className="flex flex-col gap-2 items-center justify-center py-10">
      {children}
    </Card>
  );
};

export default NoData;
