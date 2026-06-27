const Post = require('../models/Post');

// @desc   Get all posts (with search & category filter)
// @route  GET /api/posts
const getPosts = async (req, res) => {
  const { search, category, page = 1, limit = 9 } = req.query;

  const query = {};
  if (category && category !== 'All') query.category = category;
  if (search) query.title = { $regex: search, $options: 'i' };

  const total = await Post.countDocuments(query);
  const posts = await Post.find(query)
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ posts, total, pages: Math.ceil(total / limit) });
};

// @desc   Get single post
// @route  GET /api/posts/:id
const getPost = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'name avatar bio');
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
};

// @desc   Create post
// @route  POST /api/posts
const createPost = async (req, res) => {
  const { title, content, category, tags } = req.body;

  if (!title || !content)
    return res.status(400).json({ message: 'Title and content are required' });

  const post = await Post.create({
    title,
    content,
    category: category || 'Other',
    tags: tags ? tags.split(',').map((t) => t.trim()) : [],
    coverImage: req.file ? req.file.path : '',
    author: req.user._id,
  });

  await post.populate('author', 'name avatar');
  res.status(201).json(post);
};

// @desc   Update post
// @route  PUT /api/posts/:id
const updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  if (post.author.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized to edit this post' });

  const { title, content, category, tags } = req.body;
  post.title = title || post.title;
  post.content = content || post.content;
  post.category = category || post.category;
  post.tags = tags ? tags.split(',').map((t) => t.trim()) : post.tags;
  if (req.file) post.coverImage = req.file.path;

  const updated = await post.save();
  await updated.populate('author', 'name avatar');
  res.json(updated);
};

// @desc   Delete post
// @route  DELETE /api/posts/:id
const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  if (post.author.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized to delete this post' });

  await post.deleteOne();
  res.json({ message: 'Post deleted' });
};

// @desc   Like / Unlike post
// @route  PUT /api/posts/:id/like
const likePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const alreadyLiked = post.likes.includes(req.user._id);
  if (alreadyLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
  } else {
    post.likes.push(req.user._id);
  }

  await post.save();
  res.json({ likes: post.likes.length, liked: !alreadyLiked });
};

// @desc   Get posts by author
// @route  GET /api/posts/user/:userId
const getPostsByUser = async (req, res) => {
  const posts = await Post.find({ author: req.params.userId })
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 });
  res.json(posts);
};

module.exports = { getPosts, getPost, createPost, updatePost, deletePost, likePost, getPostsByUser };
