
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import PageTransition from "./PageTransition";

const Layout = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 pt-16 pb-12 mx-auto max-w-7xl">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <footer className="py-6 border-t border-border bg-thyroid-50 dark:bg-thyroid-900">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Thyroid Guardian. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
