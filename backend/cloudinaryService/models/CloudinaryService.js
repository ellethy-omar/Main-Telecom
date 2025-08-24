const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

class CloudinaryService {
  static async uploadImage(buffer, options = {}) {
    try {
      return new Promise((resolve, reject) => {
        const uploadOptions = {
          resource_type: 'image',
          folder: 'main-telecom',
          transformation: [
            { width: 500, height: 500, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' }
          ],
          ...options
        };

        cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(buffer);
      });
    } catch (error) {
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }

  static async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      throw new Error(`Image deletion failed: ${error.message}`);
    }
  }

  static extractPublicIdFromUrl(url) {
    try {
      // Example URL:
      // https://res.cloudinary.com/<cloud_name>/image/upload/v1725531845/profile-images/agent_123_1725531845.jpg
      const parts = url.split('/upload/')[1]; // profile-images/agent_123_1725531845.jpg
      const withoutVersion = parts.replace(/v[0-9]+\//, ''); // remove v<number>/
      const withoutExt = withoutVersion.replace(/\.[^/.]+$/, ''); // remove .jpg, .png, etc.
      return withoutExt;
    } catch {
      return null;
    }
  }


  static async handleProfileImageUpload(agentId, imageBuffer, oldImageUrl = null) {
    try {
      let oldPublicId = null;
      if (oldImageUrl) {
        oldPublicId = this.extractPublicIdFromUrl(oldImageUrl);
      }

      const uploadResult = await this.uploadImage(imageBuffer, {
        public_id: `profile-images/agent_${agentId}_${Date.now()}`
      });

      if (oldPublicId) {
        this.deleteImage(oldPublicId).catch(err => {
          console.error('Failed to delete old image:', err);
        });
      }

      return {
        success: true,
        imageURL: uploadResult.secure_url,
        message: 'Image uploaded successfully'
      };

    } catch (error) {
      console.error('Profile image upload failed:', error);
      throw error;
    }
  }
}

module.exports = CloudinaryService;