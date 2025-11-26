import { ReactNode } from "react";

type LoginProps = {
  children: ReactNode;
};
const CredentialsLayout = ({ children }: LoginProps) => {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] h-[100vh]">
      <div className="hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[450px] gap-6">{children}</div>
      </div>
    </div>
  );
};

export default CredentialsLayout;
