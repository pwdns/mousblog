'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query)}`);
    }
  };

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setAllPosts(data));
  }, []);

  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = allPosts.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.author?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query, allPosts]);

  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6 relative">
        <Link href="/" className="flex items-center gap-2 text-white hover:text-blue-400 transition">
          <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
          <span className="text-xl font-bold">MouseBlog</span>
        </Link>

        <div className="relative w-full max-w-md">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search posts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
          </form>
          {results.length > 0 && (
            <ul className="absolute top-full left-0 right-0 bg-white text-black shadow-lg mt-1 rounded-md max-h-60 overflow-y-auto z-50">
              {results.map(post => (
                <li
                  key={post.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => router.push(`/post/${post.id}`)}
                >
                  🔍 {post.title} <span className="text-xs text-gray-500">by {post.author}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Link href="/create">
          <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition">
            + Create Post
          </button>
        </Link>
      </div>
    </nav>
  );
}
