'use client';
import { useState } from 'react';

export default function LikeDislike({ postId, initialLikes, initialDislikes }) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);

  const handleVote = async (type) => {
    const res = await fetch(`/api/posts/${postId}/${type}`, {
      method: 'POST',
    });
    if (res.ok) {
      type === 'like' ? setLikes(likes + 1) : setDislikes(dislikes + 1);
    }
  };

  return (
    <div className="flex items-center gap-4 mt-4">
      <button onClick={() => handleVote('like')} className="text-green-400 hover:text-green-500">
        👍 {likes}
      </button>
      <button onClick={() => handleVote('dislike')} className="text-red-400 hover:text-red-500">
        👎 {dislikes}
      </button>
    </div>
  );
}
