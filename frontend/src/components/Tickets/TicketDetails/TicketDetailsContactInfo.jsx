import { motion } from 'framer-motion';

const TicketDetailsContactInfo = ({contactProfile}) => {
    return (
        <motion.div
            className="bg-white shadow rounded-xl p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">👤 Contact Info</h2>
            <p><strong>Name:</strong> {contactProfile.firstName} {contactProfile.lastName}</p>
            <p><strong>Phone:</strong> {contactProfile.phone}</p>
            <p><strong>Email:</strong> {contactProfile.email}</p>
            <p><strong>Company:</strong> {contactProfile.company}</p>
            <p><strong>Position:</strong> {contactProfile.position}</p>
            <p><strong>Notes:</strong> {contactProfile.notes}</p>
        </motion.div>
    )
}


export default TicketDetailsContactInfo;