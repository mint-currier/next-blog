import { getPostById } from "@/lib/post";
import { Post } from "@/types/post";
import { format } from "date-fns";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ja } from "date-fns/locale/ja";

type PostDetailPageParams = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PostDetailPage({ params }: PostDetailPageParams) {
  const { id } = await params;

  const post = (await getPostById(id)) as Post;
  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto py-0">
        <CardHeader className="relative w-full h-64 lg:h-96">
          <Image
            src={post.topImage || ""}
            alt={post.title}
            fill
            sizes="100vw"
            priority
            className="rounded-t-md object-cover"
          />

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-4">
            <CardTitle className="text-3xl lg:text-5xl font-extrabold mb-2">
              {post.title}
            </CardTitle>
            <div className="flex justify-between items-center">
              <p className="text-sm">投稿者: {post.author.name}</p>
              <time className="text-sm">
                {format(post.createdAt, "yyyy/MM/dd", { locale: ja })}
              </time>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 text-sm text-gray-600">
          <p>{post.content}</p>
        </CardContent>
      </Card>
    </div>
    // <div className="container mx-auto px-4 py-8">
    //   <div className="relative w-full h-64 mb-4">
    //     <Image className="rounded-lg" src={post.topImage || ""} alt="" fill />
    //   </div>
    //   <h1 className="text-3xl font-bold my-4">{post.title}</h1>
    //   <p className="text-sm text-gray-600 mb-4">{post.content}</p>
    //   <div className="text-sm text-gray-600 mb-4">{post.author.name}</div>
    //   <div className="text-sm text-gray-600 mb-4">
    //     {format(post.createdAt, "yyyy/MM/dd")}
    //   </div>
    // </div>
  );
}
