import { motion } from 'framer-motion';
import ProfileEditForm from './ProfileEditForm';
import { profileService } from '../../services/profileService';

const ProfileInfoCard = ({
  profile,
  form,
  setForm,
  editingInfo,
  setEditingInfo,
  setAlert,
  setProfile,
}) => (
  <motion.div
    className="bg-white p-6 rounded-xl shadow"
    initial={{ x: 100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <h4 className="text-lg font-semibold mb-4">Contact Information</h4>

    {editingInfo ? (
      <ProfileEditForm
        form={form}
        setForm={setForm}
        onSave={async () => {
          try {
            await profileService.updateProfile(form);
            setProfile(prev => ({ ...prev, ...form }));
            setAlert({ message: 'Profile updated successfully!', type: 'success' });
            setEditingInfo(false);
          } catch (err) {
            setAlert({ message: 'Failed to update profile', type: 'error' });
          }
        }}
        onCancel={() => {
          setForm({
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            phone: profile.phone,
          });
          setEditingInfo(false);
        }}
      />
    ) : (
      <>
        <div><label className="font-medium">First Name:</label><p className="text-gray-700">{profile.firstName}</p></div>
        <div><label className="font-medium">Last Name:</label><p className="text-gray-700">{profile.lastName}</p></div>
        <div><label className="font-medium">Email:</label><p className="text-gray-700">{profile.email}</p></div>
        <div><label className="font-medium">Phone:</label><p className="text-gray-700">{profile.phone}</p></div>
        <button
          onClick={() => setEditingInfo(true)}
          className="mt-4 text-blue-600 hover:underline text-sm"
        >
          Edit Info
        </button>
      </>
    )}
  </motion.div>
);

export default ProfileInfoCard;
