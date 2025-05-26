import Navbar from "@/components/layout/main-layout/Navbar";
import { PropsWithChildren } from "react";

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Navbar />
      <main className="h-full w-full">{children}</main>
    </>
  );
};

export default MainLayout;
