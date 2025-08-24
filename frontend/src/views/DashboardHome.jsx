import { motion } from "framer-motion";

const DashboardHome = () => {
  return (
    <div className="p-10 min-h-screen bg-gray-50">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">Welcome back 👋</h1>
        <p className="text-lg text-gray-600">Here’s what’s happening with your dashboard today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-xl font-semibold mb-2">📊 Summary Widget</h2>
          <p className="text-gray-600">Quick stats and metrics at a glance.</p>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-2">📅 Upcoming Events</h2>
          <p className="text-gray-600">Don't miss your scheduled tasks and events.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;
