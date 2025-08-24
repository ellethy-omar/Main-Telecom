import { useEffect, useState } from 'react';
import { profileService } from '../services/profileService';
import Loading from '../components/Loading/Loading';
import Alert from '../components/Alert/Alert';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileImageCard from '../components/Profile/ProfileImageCard';
import ProfileInfoCard from '../components/Profile/ProfileInfoCard';

const DashboardProfile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [editingInfo, setEditingInfo] = useState(false);
  const [editingImage, setEditingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await profileService.getProfile();

        setProfile(data);
        setForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
        });
      } catch (error) {
        setAlert({
          message: "Error fetching profile",
          type: "danger"
        })
      }
    };
    loadProfile();
  }, []);

  const handleImageChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUpload = async (file) => {
    if (!file || !profile) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('oldImageUrl', profile.imageUrl);

    try {
      setUploading(true);
      const newURL = await profileService.updateProfileImage(formData);
      setProfile({ ...profile, imageUrl: newURL });
      setEditingImage(false);
      setSelectedFile(null);
      setAlert({ message: 'Image Updated Successfully!', type: 'success' });
    } catch (err) {
      setAlert({ message: err.message || 'Failed to upload image.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  if (!profile) return <Loading />;

  return (
    <div className="p-6">
      <ProfileHeader name={`${profile.firstName} ${profile.lastName}`} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <ProfileImageCard
          profile={profile}
          editingImage={editingImage}
          setEditingImage={setEditingImage}
          selectedFile={selectedFile}
          handleImageChange={handleImageChange}
          handleUpload={handleUpload}
          uploading={uploading}
          setSelectedFile={setSelectedFile}
        />
        <ProfileInfoCard
          profile={profile}
          form={form}
          setForm={setForm}
          editingInfo={editingInfo}
          setEditingInfo={setEditingInfo}
          setAlert={setAlert}
          setProfile={setProfile}
        />
      </div>
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
    </div>
  );
};

export default DashboardProfile;
