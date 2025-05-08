import pool from './db';

export async function getComments(postId) {
  const [comments] = await pool.query(
    'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC',
    [postId]
  );
  return comments;
}

export async function addComment(postId, content, parentId = null) {
  const [result] = await pool.query(
    'INSERT INTO comments (post_id, content, parent_id) VALUES (?, ?, ?)',
    [postId, content, parentId]
  );
  return { id: result.insertId, content, parentId };
}
