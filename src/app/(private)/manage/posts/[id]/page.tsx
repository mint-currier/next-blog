import { format } from "date-fns";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ja } from "date-fns/locale/ja";
import { getOwnPost } from "@/lib/ownPost";
import { auth } from "@/lib/auth";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

type PostDetailPageParams = {
  params: Promise<{
    id: string;
  }>;
};
export default async function ShowPage({ params }: PostDetailPageParams) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId || !session?.user.email) {
    throw new Error("不正なリクエストです。");
  }

  const post = await getOwnPost(userId, id);
  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto py-0">
        <CardHeader className="relative w-full h-64 lg:h-96">
          {post.topImage && (
            <Image
              src={post.topImage || ""}
              alt={post.title}
              fill
              sizes="100vw"
              priority
              className="rounded-t-md object-cover"
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-4">
            <CardTitle className="text-3xl lg:text-5xl font-extrabold mb-2">
              {post.title}
            </CardTitle>
            <div className="flex justify-between items-center">
              <p className="text-sm">投稿者: {post.author.name}</p>
              <time className="text-sm">
                {format(post.createdAt, "yyyy/MM/dd HH:mm:ss", { locale: ja })}
              </time>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 text-sm text-gray-600">
          <div className="prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              skipHtml={false}
              unwrapDisallowed={true}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
