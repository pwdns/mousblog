import CommentSection from '@/components/CommentSection';
import { getPostById } from '@/lib/posts-data';

// 🕒 Helper function for relative time
function timeAgo(date) {
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };
  for (const [unit, value] of Object.entries(intervals)) {
    const delta = Math.floor(seconds / value);
    if (delta > 0) return `${delta} ${unit}${delta > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

export default async function PostPage({ params }) {
  const post = await getPostById(params.id);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-neutral-900 text-white min-h-screen">
      <article className="mb-10 bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-700">
        <h1 className="text-3xl font-bold text-gray-400 mb-2">{post.title}</h1>
        <p className="text-sm text-neutral-400">Written by: {post.author || 'Anonymous'}</p>
        <p className="text-xs text-neutral-500 mb-4">🕒 {timeAgo(post.created_at)}</p>
        <p className="whitespace-pre-line text-neutral-100 leading-relaxed">{post.content}</p>
      </article>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-white">💬 Comments</h2>
        <CommentSection postId={params.id} />
      </section>
    </div>
  );
}
