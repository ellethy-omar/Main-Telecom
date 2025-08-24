import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AlertSessionExpire from '../components/Alert/AlertSessionExpire';
import { setAuthContext } from '../utils/apiInterceptor';
import Sidebar from '../components/SideBar/Sidebar';
import DashboardAnalytics from '../views/DashboardAnalytics';
import DashboardContacts from '../views/DashboardContacts';
import DashboardProfile from '../views/DashboardProfile';
import DashboardHome from '../views/DashboardHome';
import DashboardTicket from '../views/DashboardTickets';
import DashboardCalls from '../views/DashboardCalls';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, forceLogout, sessionExpired, setSessionExpired } = useAuth();

  useEffect(() => {
    setAuthContext({ forceLogout, setSessionExpired });
  }, [forceLogout, setSessionExpired]);


  const location = useLocation();
  useEffect(() => {
    const getTitleFromPath = (pathname) => {
      if (pathname.includes('/analytics')) return 'Analytics | Dashboard';
      if (pathname.includes('/contacts')) return 'Contacts | Dashboard';
      if (pathname.includes('/profile')) return 'Profile | Dashboard';
      if (pathname.includes('/tickets')) return 'Tickets | Dashboard';
      if (pathname.includes('/calls')) return 'Calls | Dashboard';
      if (pathname.includes('/home')) return 'Home | Dashboard';
      return 'Dashboard';
    };
    document.title = getTitleFromPath(location.pathname);
  }, [location]);


  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        logout={logout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white shadow-sm border-b px-6 py-4 flex items-center">
          {/* This button appears of opening the sideMenun only when the screen is not wide enough */}
          <button className="lg:hidden mr-4" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="home" element={<DashboardHome />} />
            <Route path="analytics/*" element={<DashboardAnalytics />} />
            <Route path="contacts/*" element={<DashboardContacts />} />
            <Route path="profile/*" element={<DashboardProfile />} />
            <Route path="tickets/*" element={<DashboardTicket />} />
            <Route path='calls/*' element= {<DashboardCalls />} />
            <Route path="*" element={<DashboardHome />} />
          </Routes>
        </div>
      </div>
      {sessionExpired && <AlertSessionExpire />}
    </div>
  );
};

export default Dashboard;