import { motion } from 'framer-motion';

const ProfileHeader = ({ name }) => (
  <>
    <motion.h2
      className="text-2xl font-bold mb-2"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.5 }}
    >
      Welcome back, {name}
    </motion.h2>
    <motion.p
      className="text-gray-700 mb-4"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      Here is your profile overview.
    </motion.p>
  </>
);

export default ProfileHeader;
