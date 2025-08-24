import { Link, useLocation } from 'react-router-dom';

const SideBarNavigationItem = ({ item, setSidebarOpen }) => {
  const location = useLocation();
  const current = location.pathname.includes(item.name.toLowerCase());

  return (
    <Link
      to={`/dashboard/${item.name.toLowerCase()}`}
      onClick={() => setSidebarOpen(false)}
      className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
        current
          ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-700'
          : 'text-gray-700'
      }`}
    >
      <item.icon className="w-5 h-5 mr-3" />
      {item.name}
    </Link>
  );
};

export default SideBarNavigationItem;
