import { motion } from "framer-motion";


const AnalyticsHeader = ()=> {
    <motion.div
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
    >
        <h2 className="text-2xl font-bold text-gray-800">📈 Analytics Overview</h2>
        <p className="text-gray-600">Here's a breakdown of ticket activity and user trends.</p>
    </motion.div>
}

export default AnalyticsHeader