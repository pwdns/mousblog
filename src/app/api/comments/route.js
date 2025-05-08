import { getComments, addComment } from '@/lib/comments-data';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');
  const comments = await getComments(postId);
  return Response.json(comments);
}

export async function POST(request) {
  const { postId, content, parentId } = await request.json();
  const comment = await addComment(postId, content, parentId || null);
  return Response.json(comment, { status: 201 });
}
