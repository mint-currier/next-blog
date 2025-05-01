import PostCard from "@/components/post/PostCard";
import { getPosts, searchPosts } from "@/lib/post";
import { Post } from "@/types/post";

type SearchParams = {
  searchParams: Promise<{ search?: string }>;
};

export default async function PostsPage({ searchParams }: SearchParams) {
  // const posts = (await getPosts()) as Post[];

  const { search } = await searchParams;

  const posts = search
    ? ((await searchPosts(search)) as Post[])
    : ((await getPosts()) as Post[]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
