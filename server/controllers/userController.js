const User = require('../models/User');

// @desc   Get user profile by ID
// @route  GET /api/users/:id
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password').populate('followers following', 'name avatar');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

// @desc   Update logged in user profile
// @route  PUT /api/users/profile
const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.name = req.body.name || user.name;
  user.bio = req.body.bio || user.bio;
  if (req.file) user.avatar = req.file.path;

  const updated = await user.save();
  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    avatar: updated.avatar,
    bio: updated.bio,
  });
};

// @desc   Follow / Unfollow a user
// @route  PUT /api/users/:id/follow
const followUser = async (req, res) => {
  if (req.params.id === req.user._id.toString())
    return res.status(400).json({ message: "You can't follow yourself" });

  const targetUser = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user._id);

  if (!targetUser) return res.status(404).json({ message: 'User not found' });

  const isFollowing = targetUser.followers.includes(req.user._id);

  if (isFollowing) {
    // Unfollow
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== req.params.id
    );
  } else {
    // Follow
    targetUser.followers.push(req.user._id);
    currentUser.following.push(req.params.id);
  }

  await targetUser.save();
  await currentUser.save();

  res.json({
    followers: targetUser.followers.length,
    following: !isFollowing,
  });
};

// @desc   Search users
// @route  GET /api/users/search?q=name
const searchUsers = async (req, res) => {
  const { q } = req.query;
  const users = await User.find({ name: { $regex: q, $options: 'i' } })
    .select('name avatar bio')
    .limit(10);
  res.json(users);
};

module.exports = { getUserProfile, updateProfile, followUser, searchUsers };
