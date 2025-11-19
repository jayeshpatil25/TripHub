const express = require("express");
const { updateUser, updatePassword } = require("../controllers/userController");
const auth = require('../middleware/authMiddleware');
const router = express.Router();
const { uploadProfilePic, deleteProfilePic } = require("../controllers/userController");
const { upload } = require("../middleware/cloudinary");
const mongoose = require('mongoose');
const User = require('../models/User');
const { getUsersByIds } = require('../controllers/userController');

router.put("/update", auth, updateUser);
router.put("/password", auth, updatePassword);

router.post('/profile-picture', auth, upload.single('profilePic'), uploadProfilePic);
router.delete('/profile-picture', auth, deleteProfilePic);


router.post('/getUsersByIds', async (req, res) => {
  try {
    const { userIds } = req.body;
    const users = await User.find({ 
      '_id': { $in: userIds.map(id => mongoose.Types.ObjectId(id)) }
    }).select('name email');
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;