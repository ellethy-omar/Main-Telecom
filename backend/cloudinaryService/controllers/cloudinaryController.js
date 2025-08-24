const CloudinaryService = require('../models/CloudinaryService');

const RedisMQConfig = require('../../shared/redisMQConfig');
const { createClient } = require('redis');
const redisMQ = new RedisMQConfig(createClient);

const eventsWithHandlers = require('./eventsWithHandlers')
redisMQ.subscribeMultiple(eventsWithHandlers);

async function uploadImage(req, res) {
  try {
    const agentId    = req.user.id;
    const oldImageUrl = req.body.oldImageUrl;
    console.log(oldImageUrl);

    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const result = await CloudinaryService.handleProfileImageUpload(
      agentId,
      req.file.buffer,
      oldImageUrl
    );

    const redisMessage = {
      agentID: agentId,
      imageURL: result.imageURL,
      action:   'upload',
      timestamp: new Date().toISOString()
    }

    await redisMQ.publish('cloudinary:updateImageURL', redisMessage);

    res.status(200).json(result);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Image upload failed', message: error.message });
  }
}

async function deleteImage(req, res) {
  try {
    const agentId    = req.user.id;
    const { publicId } = req.body;
    if (!publicId || !agentId) {
      return res.status(400).json({ error: 'Public ID and Agent ID are required' });
    }

    await CloudinaryService.deleteImage(publicId);

    const redisMessage = {
      agentID: agentId,
      imageURL: null,
      action:   'delete',
      timestamp: new Date().toISOString()
    }

    await redisMQ.publish('cloudinary:updateImageURL', redisMessage);

    res.status(200).json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Image deletion failed', message: error.message });
  }
}

module.exports = {
    uploadImage,
    deleteImage
}