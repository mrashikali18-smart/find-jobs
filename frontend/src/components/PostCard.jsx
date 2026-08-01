import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { postApi } from '../api/services';
import { useAuth } from '../context/AuthContext';

export default function PostCard({ post, onDeleted }) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const liked = likes.some((id) => (id._id || id) === user._id);

  const handleLike = async () => {
    // optimistic update
    setLikes((prev) =>
      liked ? prev.filter((id) => (id._id || id) !== user._id) : [...prev, user._id]
    );
    try {
      const { data } = await postApi.toggleLike(post._id);
      setLikes(data.likes);
    } catch {
      toast.error('Could not update like');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await postApi.addComment(post._id, { text: commentText });
      setComments(data.comments);
      setCommentText('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await postApi.remove(post._id);
      toast.success('Post deleted');
      onDeleted?.(post._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete post');
    }
  };

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <Link to={`/profile/${post.author?._id}`} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-50 font-display text-sm text-ink-700">
            {post.author?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-800">{post.author?.name}</p>
            <p className="text-xs text-ink-700/60">
              {post.author?.headline || (post.author?.role === 'recruiter' ? post.author?.companyName : '')}
            </p>
            <p className="text-xs text-ink-700/40">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </Link>
        {post.author?._id === user._id && (
          <button onClick={handleDelete} className="text-ink-700/40 hover:text-red-600">
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-700/90">
        {post.content}
      </p>

      {post.imageUrl && (
        <img src={post.imageUrl} alt="" className="mt-3 max-h-96 w-full rounded-xl object-cover" />
      )}

      {post.job && (
        <Link
          to={`/jobs/${post.job._id}`}
          className="mt-3 inline-block rounded-lg bg-amber-400/15 px-3 py-1.5 text-xs font-medium text-amber-600"
        >
          📌 Hiring: {post.job.title}
        </Link>
      )}

      <div className="mt-4 flex items-center gap-5 border-t border-ink-700/10 pt-3 text-sm text-ink-700/70">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 ${liked ? 'text-amber-500' : ''}`}
        >
          <Heart size={16} fill={liked ? 'currentColor' : 'none'} /> {likes.length}
        </button>
        <button onClick={() => setShowComments((s) => !s)} className="flex items-center gap-1.5">
          <MessageCircle size={16} /> {comments.length}
        </button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-3 border-t border-ink-700/10 pt-3">
          {comments.map((c) => (
            <div key={c._id} className="flex gap-2 text-sm">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-50 text-xs text-ink-700">
                {c.author?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="rounded-xl bg-ink-50 px-3 py-2">
                <p className="text-xs font-semibold text-ink-800">{c.author?.name}</p>
                <p className="text-ink-700/80">{c.text}</p>
              </div>
            </div>
          ))}
          <form onSubmit={handleComment} className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment…"
              className="input-field"
            />
            <button type="submit" disabled={submitting} className="btn-outline shrink-0">
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
