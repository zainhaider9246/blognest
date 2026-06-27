import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const BlogDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          api.get(`/posts/${id}`),
          api.get(`/comments/${id}`),
        ]);
        setPost(postRes.data);
        setLikeCount(postRes.data.likes?.length || 0);
        if (user) setLiked(postRes.data.likes?.includes(user._id));
        setComments(commentsRes.data);
      } catch {
        toast.error('Post not found');
        navigate('/blogs');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleLike = async () => {
    if (!user) return toast.info('Login to like posts');
    try {
      const { data } = await api.put(`/posts/${id}/like`);
      setLikeCount(data.likes);
      setLiked(data.liked);
    } catch {
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return toast.info('Login to comment');
    if (!commentText.trim()) return;
    try {
      const { data } = await api.post(`/comments/${id}`, { text: commentText });
      setComments([data, ...comments]);
      setCommentText('');
    } catch {
      toast.error('Failed to post comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  const handleFollow = async () => {
    if (!user) return toast.info('Login to follow authors');
    try {
      const { data } = await api.put(`/users/${post.author._id}/follow`);
      setFollowing(data.following);
      toast.success(data.following ? `Following ${post.author.name}` : `Unfollowed ${post.author.name}`);
    } catch {
      toast.error('Failed to follow');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      toast.success('Post deleted');
      navigate('/blogs');
    } catch {
      toast.error('Failed to delete post');
    }
  };

  if (loading) return (
    <div className="text-center py-5 mt-5">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  if (!post) return null;

  const readTime = Math.ceil(post.content.split(' ').length / 200);
  const isAuthor = user?._id === post.author._id;

  return (
    <div className="container my-5" style={{ maxWidth: 780 }}>
      {/* Category & Meta */}
      <div className="d-flex align-items-center gap-3 mb-3">
        <span className="bn-badge">{post.category}</span>
        <small className="text-muted"><i className="bi bi-clock me-1"></i>{readTime} min read</small>
        <small className="text-muted"><i className="bi bi-calendar3 me-1"></i>{new Date(post.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</small>
      </div>

      <h1 className="fw-bold display-6 mb-4">{post.title}</h1>

      {/* Author card */}
      <div className="d-flex align-items-center justify-content-between mb-4 p-3 rounded-3 bg-body-secondary">
        <Link to={`/profile/${post.author._id}`} className="d-flex align-items-center gap-3 text-decoration-none text-body">
          <div className="bn-avatar">
            {post.author.avatar
              ? <img src={post.author.avatar} alt="" className="rounded-circle" style={{ width: 40, height: 40, objectFit: 'cover' }} />
              : post.author.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="fw-semibold">{post.author.name}</div>
            <small className="text-muted">{post.author.bio || 'BlogNest author'}</small>
          </div>
        </Link>
        {!isAuthor && (
          <button className={`btn btn-sm rounded-pill ${following ? 'btn-secondary' : 'btn-outline-primary'}`} onClick={handleFollow}>
            <i className={`bi bi-${following ? 'check-lg' : 'plus-lg'} me-1`}></i>
            {following ? 'Following' : 'Follow'}
          </button>
        )}
        {isAuthor && (
          <div className="d-flex gap-2">
            <Link to={`/edit/${post._id}`} className="btn btn-sm btn-outline-primary rounded-pill">
              <i className="bi bi-pencil me-1"></i>Edit
            </Link>
            <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={handleDelete}>
              <i className="bi bi-trash me-1"></i>Delete
            </button>
          </div>
        )}
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} className="bn-cover-img mb-4" />
      )}

      {/* Content */}
      <div className="bn-post-content mb-5">{post.content}</div>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, i) => (
            <span key={i} className="badge bg-body-secondary text-body border rounded-pill">#{tag}</span>
          ))}
        </div>
      )}

      {/* Like */}
      <div className="d-flex align-items-center gap-3 py-4 border-top border-bottom mb-5">
        <button
          className={`btn btn-sm rounded-pill d-flex align-items-center gap-2 bn-like-btn ${liked ? 'liked btn-danger' : 'btn-outline-secondary'}`}
          onClick={handleLike}
        >
          <i className={`bi bi-heart${liked ? '-fill' : ''}`}></i>
          <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
        </button>
        <span className="text-muted small"><i className="bi bi-chat me-1"></i>{comments.length} comments</span>
      </div>

      {/* Comments */}
      <h5 className="fw-bold mb-4">Comments ({comments.length})</h5>

      {user && (
        <form onSubmit={handleComment} className="mb-4">
          <div className="d-flex gap-2">
            <textarea
              className="form-control"
              rows={2}
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{ borderRadius: 12, resize: 'none' }}
            />
            <button type="submit" className="btn btn-primary rounded-3 px-3">
              <i className="bi bi-send-fill"></i>
            </button>
          </div>
        </form>
      )}

      {comments.length === 0 ? (
        <p className="text-muted text-center py-3">No comments yet. Be the first!</p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {comments.map((c) => (
            <div key={c._id} className="d-flex gap-3 p-3 rounded-3 bg-body-secondary">
              <div className="bn-avatar flex-shrink-0" style={{ width: 36, height: 36, fontSize: '0.85rem' }}>
                {c.author.avatar
                  ? <img src={c.author.avatar} alt="" className="rounded-circle" style={{ width: 36, height: 36, objectFit: 'cover' }} />
                  : c.author.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <span className="fw-semibold small me-2">{c.author.name}</span>
                    <small className="text-muted">{new Date(c.createdAt).toLocaleDateString()}</small>
                  </div>
                  {user?._id === c.author._id && (
                    <button className="btn btn-sm text-danger p-0" onClick={() => handleDeleteComment(c._id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  )}
                </div>
                <p className="mb-0 mt-1 small">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
