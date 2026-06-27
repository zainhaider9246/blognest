import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('bio', form.bio);
      if (avatar) formData.append('avatar', avatar);

      const { data } = await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      updateUser(data);
      toast.success('Profile updated!');
      navigate(`/profile/${user._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center my-5">
      <div className="card bn-card shadow border-0 p-4" style={{ width: '100%', maxWidth: 500 }}>
        <h3 className="fw-bold mb-4">Edit Profile</h3>

        <form onSubmit={handleSubmit}>
          {/* Avatar */}
          <div className="text-center mb-4">
            <div className="bn-avatar mx-auto mb-3" style={{ width: 90, height: 90, fontSize: '2rem' }}>
              {preview
                ? <img src={preview} alt="" className="rounded-circle" style={{ width: 90, height: 90, objectFit: 'cover' }} />
                : user?.name?.[0]?.toUpperCase()}
            </div>
            <label className="btn btn-outline-secondary btn-sm rounded-pill">
              <i className="bi bi-camera me-1"></i>Change Photo
              <input type="file" hidden accept="image/*" onChange={handleAvatar} />
            </label>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Name</label>
            <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required style={{ borderRadius: 10 }} />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Bio <small className="text-muted">(max 200 chars)</small></label>
            <textarea
              name="bio"
              className="form-control"
              rows={3}
              placeholder="Tell readers about yourself..."
              value={form.bio}
              maxLength={200}
              onChange={handleChange}
              style={{ borderRadius: 10, resize: 'none' }}
            />
            <small className="text-muted">{form.bio.length}/200</small>
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary rounded-pill flex-grow-1 py-2 fw-semibold" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
              Save Changes
            </button>
            <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
