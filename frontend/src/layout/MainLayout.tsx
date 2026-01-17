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
      <Header />
      <main className="flex-1 px-2 pt-6 md:pt-20 pb-16 md:pb-4">{children}</main>
      <Navbar />
      <Footer />
    </div>
  );
}
