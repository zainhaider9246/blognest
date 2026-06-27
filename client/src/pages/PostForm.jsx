import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

const CATEGORIES = ['Technology', 'Lifestyle', 'Travel', 'Food', 'Science', 'Health', 'Business', 'Other'];

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({ title: '', content: '', category: 'Other', tags: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      api.get(`/posts/${id}`).then(({ data }) => {
        setForm({
          title: data.title,
          content: data.content,
          category: data.category,
          tags: data.tags?.join(', ') || '',
        });
        setPreview(data.coverImage || '');
      });
    }
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return toast.error('Title and content are required');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      formData.append('category', form.category);
      formData.append('tags', form.tags);
      if (image) formData.append('coverImage', image);

      if (isEditing) {
        await api.put(`/posts/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Post updated!');
        navigate(`/blog/${id}`);
      } else {
        const { data } = await api.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Post published!');
        navigate(`/blog/${data._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: 760 }}>
      <h2 className="fw-bold mb-4">{isEditing ? 'Edit Post' : 'Write a New Post'}</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Title</label>
          <input
            type="text"
            name="title"
            className="form-control form-control-lg"
            placeholder="Your post title..."
            value={form.title}
            onChange={handleChange}
            required
            style={{ borderRadius: 10 }}
          />
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Category</label>
            <select name="category" className="form-select" value={form.category} onChange={handleChange} style={{ borderRadius: 10 }}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Tags <small className="text-muted">(comma separated)</small></label>
            <input type="text" name="tags" className="form-control" placeholder="react, nodejs, tips" value={form.tags} onChange={handleChange} style={{ borderRadius: 10 }} />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Cover Image</label>
          <input type="file" className="form-control" accept="image/*" onChange={handleImage} style={{ borderRadius: 10 }} />
          {preview && (
            <img src={preview} alt="Preview" className="mt-3 rounded-3 w-100" style={{ maxHeight: 250, objectFit: 'cover' }} />
          )}
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Content</label>
          <textarea
            name="content"
            className="form-control"
            rows={14}
            placeholder="Write your story here..."
            value={form.content}
            onChange={handleChange}
            required
            style={{ borderRadius: 10, lineHeight: 1.8 }}
          />
          <small className="text-muted">{form.content.split(' ').filter(Boolean).length} words · ~{Math.ceil(form.content.split(' ').filter(Boolean).length / 200)} min read</small>
        </div>

        <div className="d-flex gap-3">
          <button type="submit" className="btn btn-primary rounded-pill px-5 py-2 fw-semibold" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-send me-2"></i>}
            {isEditing ? 'Update Post' : 'Publish Post'}
          </button>
          <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
