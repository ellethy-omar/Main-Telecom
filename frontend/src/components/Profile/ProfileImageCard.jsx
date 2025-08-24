import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Cropper from 'react-easy-crop'

const ProfileImageCard = ({
  profile,
  editingImage,
  setEditingImage,
  selectedFile,
  setSelectedFile,
  handleUpload, // We'll wrap this to upload cropped file
  uploading,
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Read file for preview
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Helper to crop the image to canvas
  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Optional: define the export size (e.g., 256x256 avatar)
    const exportSize = 256;
    canvas.width = exportSize;
    canvas.height = exportSize;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      exportSize,
      exportSize
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const file = new File([blob], selectedFile.name, { type: selectedFile.type });
        resolve(file);
      }, selectedFile.type);
    });
  };

  const handleCroppedUpload = async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
    handleUpload(croppedFile);
  };

  return (
    <motion.div
      className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {!editingImage ? (
        <>
          <img
            src={profile.imageUrl}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          <h3 className="text-xl font-semibold">
            {profile.firstName} {profile.lastName}
          </h3>
          <p className="text-gray-500">Agent ID: {profile.agentId}</p>
          <button
            onClick={() => setEditingImage(true)}
            className="mt-4 text-blue-600 hover:underline text-sm"
          >
            Edit Image
          </button>
        </>
      ) : (
        <div className="w-full flex flex-col items-center">
          {/* File Input */}
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="mb-2 block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          {/* Crop UI */}
          {imageSrc && (
            <div className="relative w-full h-64 bg-gray-100 mb-4">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          )}

          {/* Zoom Slider */}
          {imageSrc && (
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(e.target.value)}
              className="w-full mb-4"
            />
          )}

          {/* Action Buttons */}
          <div>
            <button
              onClick={handleCroppedUpload}
              disabled={uploading || !selectedFile}
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 mr-2"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
            <button
              onClick={() => {
                setEditingImage(false);
                setSelectedFile(null);
                setImageSrc(null);
              }}
              className="text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProfileImageCard;
