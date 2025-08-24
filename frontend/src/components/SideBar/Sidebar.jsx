import { Home, BarChart3, Users, User, X, LogOut, LucideTicket, PhoneCall } from 'lucide-react';
import SideBarNavigationItem from './SideBarNavigationItem';

const navItems = [
  { name: 'Home', icon: Home },
  { name: 'Tickets', icon: LucideTicket },
  { name: 'Contacts', icon: Users },
  { name: 'Calls', icon: PhoneCall },
  { name: 'Analytics', icon: BarChart3 },
  { name: 'Profile', icon: User },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen, logout }) => {
  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="ml-3 text-xl font-semibold text-gray-800">Dashboard</span>
          </div>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-8 flex-1">
          {navItems.map((item) => (
            <SideBarNavigationItem
              key={item.name}
              item={item}
              setSidebarOpen={setSidebarOpen}
            />
          ))}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
