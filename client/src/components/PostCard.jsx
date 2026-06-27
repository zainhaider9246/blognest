import { Link } from 'react-router-dom';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&q=80';

const PostCard = ({ post }) => {
  const readTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <div className="card bn-card h-100 border-0 shadow-sm">
      <img
        src={post.coverImage || PLACEHOLDER}
        className="bn-card-img"
        alt={post.title}
      />
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="bn-badge">{post.category}</span>
          <small className="text-muted">{readTime} min read</small>
        </div>

        <h5 className="card-title fw-bold mb-2 lh-sm">
          <Link to={`/blog/${post._id}`} className="text-decoration-none text-body stretched-link">
            {post.title.length > 65 ? post.title.slice(0, 65) + '…' : post.title}
          </Link>
        </h5>

        <p className="card-text text-muted small mb-3">
          {post.content.replace(/<[^>]+>/g, '').slice(0, 110)}…
        </p>

        <div className="mt-auto d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <div
              className="bn-avatar"
              style={{ width: 32, height: 32, fontSize: '0.8rem', background: '#4f46e5' }}
            >
              {post.author?.avatar
                ? <img src={post.author.avatar} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                : post.author?.name?.[0]?.toUpperCase()}
            </div>
            <small className="fw-semibold">{post.author?.name}</small>
          </div>
          <div className="d-flex align-items-center gap-3 text-muted small">
            <span><i className="bi bi-heart-fill text-danger me-1"></i>{post.likes?.length || 0}</span>
            <span><i className="bi bi-calendar3 me-1"></i>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
