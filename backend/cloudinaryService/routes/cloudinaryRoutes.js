
const router = require('express').Router();
const { upload } = require('../middleware/multer');
const {
    uploadImage,
    deleteImage
} = require('../controllers/cloudinaryController');

router.post('/uploadProfileImage/', upload.single('image'), uploadImage);

router.delete('/deleteProfileImage', deleteImage);

const { handleInvalidRoute } = require('../../shared/letMeIn');
router.use(handleInvalidRoute('Cloudinary Service'));
module.exports = router;