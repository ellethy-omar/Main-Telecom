import { motion } from "framer-motion";
import { LineChart, XAxis, YAxis, Tooltip, Line, CartesianGrid, ResponsiveContainer } from "recharts";

const AnalyticsGrowthLineChart = ({growthData}) => {

    return (
        <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="bg-white p-4 rounded-xl shadow"
      >
        <h3 className="text-lg font-semibold mb-2 text-gray-700">User Growth Over Time</h3>
        {growthData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#82ca9d" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm">No growth data available.</p>
        )}
      </motion.div>
    )
}

export default AnalyticsGrowthLineChart;