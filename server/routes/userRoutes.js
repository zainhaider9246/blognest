const express = require('express');
const router = express.Router();
const { getUserProfile, updateProfile, followUser, searchUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.get('/search', searchUsers);
router.get('/:id', getUserProfile);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.put('/:id/follow', protect, followUser);

module.exports = router;
