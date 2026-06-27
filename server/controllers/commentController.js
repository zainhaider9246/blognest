const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc   Get comments for a post
// @route  GET /api/comments/:postId
const getComments = async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 });
  res.json(comments);
};

// @desc   Add comment
// @route  POST /api/comments/:postId
const addComment = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Comment text is required' });

  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const comment = await Comment.create({
    post: req.params.postId,
    author: req.user._id,
    text,
  });

  await comment.populate('author', 'name avatar');
  res.status(201).json(comment);
};

// @desc   Delete comment
// @route  DELETE /api/comments/:id
const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });

  if (comment.author.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized' });

  await comment.deleteOne();
  res.json({ message: 'Comment deleted' });
};

module.exports = { getComments, addComment, deleteComment };
