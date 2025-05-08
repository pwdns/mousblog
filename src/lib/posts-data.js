// /src/lib/posts-data.js
import pool from './db';

export async function getPosts() {
  try {
    const [posts] = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
    return posts;
  } catch (error) {
    console.error('❌ Error in getPosts:', error);
    throw error;
  }
}

// Add this function if missing
export async function getPostById(id) {
  const [posts] = await pool.query(
    'SELECT * FROM posts WHERE id = ?', 
    [id]
  );
  return posts[0]; // Return the first match or null
}

export async function createPost({ title, author, content }) {
  const [result] = await pool.query(
    'INSERT INTO posts (title, author, content) VALUES (?, ?, ?)',
    [title, author || 'Anonymous', content]
  );
  return { id: result.insertId, title, author, content };
}