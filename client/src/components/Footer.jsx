import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="border-top mt-5 py-4 text-muted">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-md-4">
          <span className="fw-bold text-primary fs-5">
            <i className="bi bi-feather me-2"></i>BlogNest
          </span>
          <p className="small mt-1 mb-0">Stories worth reading.</p>
        </div>
        <div className="col-md-4 text-center">
          <small>© {new Date().getFullYear()} BlogNest. All rights reserved.</small>
        </div>
        <div className="col-md-4 text-md-end">
          <Link to="/" className="text-muted text-decoration-none me-3 small">Home</Link>
          <Link to="/blogs" className="text-muted text-decoration-none small">Blogs</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
