import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import api from '../utils/api';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUser?._id === id;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const [profileRes, postsRes] = await Promise.all([
          api.get(`/users/${id}`),
          api.get(`/posts/user/${id}`),
        ]);
        setProfile(profileRes.data);
        setPosts(postsRes.data);
        if (currentUser) {
          setFollowing(profileRes.data.followers?.some((f) => f._id === currentUser._id));
        }
      } catch {
        toast.error('User not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleFollow = async () => {
    if (!currentUser) return toast.info('Login to follow authors');
    try {
      const { data } = await api.put(`/users/${id}/follow`);
      setFollowing(data.following);
      setProfile((prev) => ({
        ...prev,
        followers: data.following
          ? [...(prev.followers || []), { _id: currentUser._id }]
          : (prev.followers || []).filter((f) => f._id !== currentUser._id),
      }));
    } catch {
      toast.error('Failed to follow');
    }
  };

  if (loading) return (
    <div className="text-center py-5 mt-5">
      <div className="spinner-border text-primary"></div>
    </div>
  );

  if (!profile) return null;

  return (
    <div className="container my-5">
      {/* Profile Header */}
      <div className="card bn-card border-0 shadow-sm p-4 mb-5">
        <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-4">
          <div className="bn-avatar flex-shrink-0" style={{ width: 90, height: 90, fontSize: '2rem' }}>
            {profile.avatar
              ? <img src={profile.avatar} alt="" className="rounded-circle" style={{ width: 90, height: 90, objectFit: 'cover' }} />
              : profile.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-grow-1 text-center text-md-start">
            <h3 className="fw-bold mb-1">{profile.name}</h3>
            <p className="text-muted mb-3">{profile.bio || 'No bio yet.'}</p>
            <div className="d-flex gap-4 justify-content-center justify-content-md-start mb-3">
              <div className="text-center">
                <div className="fw-bold fs-5">{posts.length}</div>
                <small className="text-muted">Posts</small>
              </div>
              <div className="text-center">
                <div className="fw-bold fs-5">{profile.followers?.length || 0}</div>
                <small className="text-muted">Followers</small>
              </div>
              <div className="text-center">
                <div className="fw-bold fs-5">{profile.following?.length || 0}</div>
                <small className="text-muted">Following</small>
              </div>
            </div>
            {isOwnProfile ? (
              <Link to="/profile/edit" className="btn btn-outline-primary rounded-pill px-4">
                <i className="bi bi-pencil me-2"></i>Edit Profile
              </Link>
            ) : (
              <button
                className={`btn rounded-pill px-4 ${following ? 'btn-secondary' : 'btn-primary'}`}
                onClick={handleFollow}
              >
                <i className={`bi bi-${following ? 'check-lg' : 'plus-lg'} me-1`}></i>
                {following ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Posts */}
      <h4 className="fw-bold mb-4">
        {isOwnProfile ? 'Your Posts' : `Posts by ${profile.name}`}
        <span className="badge bg-primary ms-2 fs-6">{posts.length}</span>
      </h4>

      {posts.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-journal-x display-4 d-block mb-3"></i>
          <p>No posts yet.</p>
          {isOwnProfile && (
            <Link to="/create" className="btn btn-primary rounded-pill px-4">
              <i className="bi bi-plus-lg me-1"></i>Write First Post
            </Link>
          )}
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
    </div>
  );
};

export default Profile;
