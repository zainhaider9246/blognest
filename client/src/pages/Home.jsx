import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import api from '../utils/api';

const CATEGORIES = ['All', 'Technology', 'Lifestyle', 'Travel', 'Food', 'Science', 'Health', 'Business', 'Other'];

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = { limit: 6 };
        if (category !== 'All') params.category = category;
        if (search) params.search = search;
        const { data } = await api.get('/posts', { params });
        setPosts(data.posts);
        if (!search && category === 'All' && data.posts.length > 0) setFeatured(data.posts[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [category, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <>
      {/* Hero */}
      <section className="bn-hero text-center">
        <div className="container">
          <h1 className="display-4 fw-bold mb-3">Stories Worth Reading</h1>
          <p className="lead mb-4 opacity-75">
            Discover ideas, perspectives, and knowledge from writers on any topic.
          </p>
          <form className="d-flex justify-content-center gap-2" onSubmit={handleSearch}>
            <input
              type="text"
              className="form-control bn-search w-50"
              placeholder="Search posts..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="btn btn-warning fw-semibold rounded-pill px-4">
              <i className="bi bi-search me-1"></i>Search
            </button>
          </form>
        </div>
      </section>

      <div className="container my-5">

        {/* Featured Post */}
        {featured && !search && category === 'All' && (
          <div className="mb-5">
            <h4 className="fw-bold mb-3"><i className="bi bi-star-fill text-warning me-2"></i>Featured Post</h4>
            <div className="card bn-card border-0 shadow-sm">
              <div className="row g-0">
                <div className="col-md-5">
                  <img
                    src={featured.coverImage || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=80'}
                    className="img-fluid rounded-start h-100 w-100"
                    style={{ objectFit: 'cover', maxHeight: 280 }}
                    alt={featured.title}
                  />
                </div>
                <div className="col-md-7">
                  <div className="card-body p-4 d-flex flex-column h-100">
                    <span className="bn-badge mb-2 d-inline-block">{featured.category}</span>
                    <h3 className="fw-bold">{featured.title}</h3>
                    <p className="text-muted">{featured.content.slice(0, 200)}…</p>
                    <div className="mt-auto">
                      <Link to={`/blog/${featured._id}`} className="btn btn-primary rounded-pill px-4">
                        Read Article <i className="bi bi-arrow-right ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm rounded-pill ${category === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => { setCategory(cat); setSearch(''); setSearchInput(''); }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-journal-x display-4 d-block mb-3"></i>
            <p>No posts found. Try a different search or category.</p>
          </div>
        ) : (
          <div className="row g-4">
            {posts.map((post) => (
              <div key={post._id} className="col-md-6 col-lg-4">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        {!search && (
          <div className="text-center mt-5">
            <Link to="/blogs" className="btn btn-outline-primary rounded-pill px-5">
              View All Posts <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
