import { createPost } from '@/lib/posts-data';
import { getPosts } from '@/lib/posts-data';

export async function GET() {
  const posts = await getPosts();
  return Response.json(posts);
}

export async function POST(request) {
  try {
    const { title, author, content } = await request.json();
    const newPost = await createPost({ title, author, content });
    return new Response(JSON.stringify(newPost), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create post' }), {
      status: 500,
    });
  }
}