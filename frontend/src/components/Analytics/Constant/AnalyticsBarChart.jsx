import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { ResponsiveContainer } from 'recharts';


const AnalyticsBarChart = ({ barData }) => {
    return (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white p-4 rounded-xl shadow"
        >
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Keyword Frequency</h3>
          {barData && barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="word" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-sm">No keyword data available.</p>
          )}
        </motion.div>
    )
}

export default AnalyticsBarChart