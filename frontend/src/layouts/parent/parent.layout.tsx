import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import ParentSidebar from "./parent.sidebar";
import ParentHeader from "./parent.header";

const ParentLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setOpenSidebar(true);
      } else {
        setOpenSidebar(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed lg:sticky top-0 left-0 h-screen z-40 transition-all duration-300 ease-in-out ${
          isMobile
            ? openSidebar
              ? 'translate-x-0'
              : '-translate-x-full'
            : openSidebar
            ? 'translate-x-0 w-64'
            : '-translate-x-64 w-0'
        }`}
      >
        <ParentSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300">
        {/* Header */}
        <div className="sticky top-0 z-30">
          <ParentHeader toggleSidebar={toggleSidebar} openSidebar={openSidebar} />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobile && openSidebar && (
        <div
          className="fixed inset-0 bg-black/60 z-30 backdrop-blur-sm transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default ParentLayout;