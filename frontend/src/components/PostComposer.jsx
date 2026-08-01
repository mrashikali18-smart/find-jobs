import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Image as ImageIcon, X } from 'lucide-react';
import { postApi } from '../api/services';
import { useAuth } from '../context/AuthContext';

export default function PostComposer({ onPosted }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      let imageUrl;
      if (imageFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('image', imageFile);
        const { data: uploadData } = await postApi.uploadImage(formData);
        imageUrl = uploadData.imageUrl;
        setUploading(false);
      }

      const { data } = await postApi.create({ content, imageUrl });
      setContent('');
      clearImage();
      onPosted?.(data.post);
      toast.success('Posted to your feed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create post');
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-5">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-50 font-display text-sm text-ink-700">
          {user.name?.[0]?.toUpperCase()}
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share an update, a win, or a job opening…"
          rows={3}
          className="input-field flex-1"
        />
      </div>

      {imagePreview && (
        <div className="relative mt-3 inline-block">
          <img
            src={imagePreview}
            alt="Selected upload preview"
            className="max-h-48 rounded-xl border border-ink-100 object-cover"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink-900 text-white"
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn-ghost !px-3 !py-1.5 text-xs"
        >
          <ImageIcon size={15} /> {imageFile ? 'Change image' : 'Add image'}
        </button>
        <button type="submit" disabled={submitting || uploading || !content.trim()} className="btn-primary">
          {uploading ? 'Uploading…' : submitting ? 'Posting…' : 'Post'}
        </button>
      </div>
    </form>
  );
}
