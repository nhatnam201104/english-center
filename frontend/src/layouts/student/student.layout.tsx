import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { StudentSidebar } from './StudentSidebar';
import { StudentHeader } from './StudentHeader';

export const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <StudentSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <StudentHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} isMenuOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};