'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePage() {
  const [formData, setFormData] = useState({ 
    title: '', 
    author: '', 
    content: '' 
  });
  const [formErrors, setFormErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const router = useRouter();

  const validateForm = () => {
    const errors = {};
    if (!formData.author.trim()) errors.author = 'Name is required';
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.content.trim()) errors.content = 'Content is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatusMessage('✅ Post created successfully! Redirecting...');
        setTimeout(() => router.push('/'), 2000);
      } else {
        setStatusMessage('❌ Failed to create post. Please try again.');
      }
    } catch (error) {
      setStatusMessage('❌ Error: ' + error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">📝 Create New Post</h1>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">What's your name?</label>
          <input
            type="text"
            placeholder="Type here..."
            className="w-full p-3 bg-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.author}
            onChange={(e) => setFormData({...formData, author: e.target.value})}
          />
          {formErrors.author && <p className="text-red-500 text-sm mt-1">{formErrors.author}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Choose a title!</label>
          <input
            type="text"
            placeholder="Type here..."
            className="w-full p-3 bg-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">What's in your mind?</label>
          <textarea
            placeholder="Type here..."
            className="w-full p-3 bg-black border border-gray-600 rounded-md h-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
          />
          {formErrors.content && <p className="text-red-500 text-sm mt-1">{formErrors.content}</p>}
        </div>

        {statusMessage && (
          <div className="p-3 text-sm text-center bg-gray-800 rounded-md text-green-400">
            {statusMessage}
          </div>
        )}

        {showConfirm ? (
          <div className="space-y-3">
            <p className="text-yellow-400">Are you sure you want to publish this post?</p>
            <div className="flex gap-3">
              <button
                type="button"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                onClick={handleSubmit}
              >
                Yes, Publish
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
              onClick={() => router.push('/')}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              onClick={() => {
                if (validateForm()) setShowConfirm(true);
              }}
            >
              Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
