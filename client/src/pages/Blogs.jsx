import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import api from '../utils/api';

const CATEGORIES = ['All', 'Technology', 'Lifestyle', 'Travel', 'Food', 'Science', 'Health', 'Business', 'Other'];

const Blogs = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 9 };
        if (category !== 'All') params.category = category;
        if (search) params.search = search;
        const { data } = await api.get('/posts', { params });
        setPosts(data.posts);
        setTotalPages(data.pages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [category, search, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategory = (cat) => {
    setCategory(cat);
    setSearch('');
    setSearchInput('');
    setPage(1);
  };

  return (
    <div className="container my-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h2 className="fw-bold mb-0">All Posts</h2>
        <form className="d-flex gap-2" onSubmit={handleSearch}>
          <input
            type="text"
            className="form-control bn-search"
            placeholder="Search posts..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary rounded-pill px-3">
            <i className="bi bi-search"></i>
          </button>
        </form>
      </div>

      {/* Categories */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm rounded-pill ${category === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => handleCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-journal-x display-4 d-block mb-3"></i>
          <p>No posts found.</p>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {posts.map((post) => (
              <div key={post._id} className="col-md-6 col-lg-4">
                <PostCard post={post} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-5 d-flex justify-content-center">
              <ul className="pagination">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button className="page-link rounded-start-pill" onClick={() => setPage(page - 1)}>
                    <i className="bi bi-chevron-left"></i>
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link rounded-end-pill" onClick={() => setPage(page + 1)}>
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default Blogs;
