import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsGovernoratePieChart = ({pieData, COLORS}) => {

    return (
        <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white p-4 rounded-xl shadow"
        >
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Governorate Distribution</h3>
            {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name }) => name}
                    outerRadius={80}
                    dataKey="value"
                >
                    {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                </PieChart>
            </ResponsiveContainer>
            ) : (
            <p className="text-gray-500 text-sm">No data available.</p>
            )}
        </motion.div>
    );
}


export default AnalyticsGovernoratePieChart;