import type { ReactNode } from "react";
import { theme } from "../theme";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: theme.colors.background }}
    >
      <div className="shrink-0">
        <Header />
      </div>

      <div className="hidden md:flex shrink-0">
        <Navbar />
      </div>

      <div className="flex-1 pb-16 md:pb-0">
        <main>{children}</main>
      </div>
      <Footer />

      <div className="md:hidden shrink-0">
        <Navbar />
      </div>
    </div>
  );
}
