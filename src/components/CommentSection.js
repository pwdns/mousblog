'use client';
import { useEffect, useState } from 'react';

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [expandedReplies, setExpandedReplies] = useState({});

  const loadComments = async () => {
    const res = await fetch(`/api/comments?postId=${postId}`);
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, content: newComment, parentId: null }),
    });
    setNewComment('');
    loadComments();
  };

  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, content: replyContent, parentId }),
    });
    setReplyTo(null);
    setReplyContent('');
    loadComments();
  };

  const toggleReplies = (id) => {
    setExpandedReplies(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getCommentById = (id) => comments.find((c) => c.id === id);

  const timeAgo = (date) => {
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
  };

  const renderComments = (parentId = null, level = 0) => {
    return comments
      .filter(comment => comment.parent_id === parentId)
      .map(comment => {
        const childReplies = comments.filter(c => c.parent_id === comment.id);
        return (
          <div key={comment.id} className={`mt-4 ${level > 0 ? 'ml-6 border-l-2 border-blue-400 pl-4' : ''}`}>
            <div className="bg-gray-800 text-white p-3 rounded-md shadow-md border border-gray-700">
              {level > 0 && (
                <p className="text-xs text-gray-400 mb-1">
                  → <em>Replying to:</em> {getCommentById(comment.parent_id)?.content.slice(0, 50) || 'Comment'}
                </p>
              )}
              <p>{comment.content}</p>
              <p className="text-xs text-gray-400 mt-1">🕒 {timeAgo(comment.created_at)}</p>
              <div className="flex gap-3 mt-1 text-sm">
                <button onClick={() => setReplyTo(comment.id)} className="text-blue-400 hover:underline">Reply</button>
                {childReplies.length > 0 && (
                  <button onClick={() => toggleReplies(comment.id)} className="text-blue-300 hover:underline">
                    {expandedReplies[comment.id] ? 'Hide replies' : `Show ${childReplies.length} repl${childReplies.length > 1 ? 'ies' : 'y'}`}
                  </button>
                )}
              </div>
              {replyTo === comment.id && (
                <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="mt-3">
                  <textarea
                    placeholder={`Replying to: ${comment.content}`}
                    className="w-full p-2 bg-black border border-gray-500 text-white rounded-md"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <div className="flex gap-2 mt-1">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm">
                      Post Reply
                    </button>
                    <button type="button" onClick={() => { setReplyTo(null); setReplyContent(''); }} className="text-red-400 text-sm">Cancel</button>
                  </div>
                </form>
              )}
            </div>
            {expandedReplies[comment.id] && renderComments(comment.id, level + 1)}
          </div>
        );
      });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          placeholder="Leave a comment..."
          className="w-full p-3 border border-gray-500 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
        />
        <button
          type="submit"
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Post
        </button>
      </form>

      <div>{renderComments()}</div>
    </div>
  );
}
