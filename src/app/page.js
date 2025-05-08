import Link from 'next/link';
import { getPosts } from '@/lib/posts-data';

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

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">📚 Recent Posts</h1>

      <div className="space-y-4">
        {posts.map(post => (
          <Link key={post.id} href={`/post/${post.id}`} className="block">
            <div className="bg-gray-800 hover:bg-gray-700 transition rounded-lg p-5 shadow-md border border-gray-700">
              <h2 className="text-xl font-semibold text-blue-400 hover:underline truncate">{post.title}</h2>
              <p className="text-sm text-gray-400 mt-1">By {post.author || 'Anonymous'}</p>
              <p className="text-xs text-gray-500">🕒 {timeAgo(post.created_at)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
