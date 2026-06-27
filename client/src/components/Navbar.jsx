import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg bn-navbar sticky-top bg-body">
      <div className="container">
        <Link className="navbar-brand bn-brand" to="/">
          <i className="bi bi-feather me-2"></i>BlogNest
        </Link>

        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/blogs">Blogs</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            {/* Dark mode toggle */}
            <button className="btn btn-sm btn-outline-secondary rounded-circle" onClick={toggleTheme} title="Toggle theme">
              <i className={`bi bi-${dark ? 'sun' : 'moon'}`}></i>
            </button>

            {user ? (
              <>
                <Link to="/create" className="btn btn-primary btn-sm rounded-pill px-3">
                  <i className="bi bi-plus-lg me-1"></i>Write
                </Link>
                <div className="dropdown">
                  <button className="btn btn-sm btn-outline-secondary rounded-pill px-3 dropdown-toggle" data-bs-toggle="dropdown">
                    <i className="bi bi-person me-1"></i>{user.name.split(' ')[0]}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><Link className="dropdown-item" to={`/profile/${user._id}`}><i className="bi bi-person-circle me-2"></i>My Profile</Link></li>
                    <li><Link className="dropdown-item" to="/profile/edit"><i className="bi bi-gear me-2"></i>Settings</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-outline-primary rounded-pill px-3">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm rounded-pill px-3">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
