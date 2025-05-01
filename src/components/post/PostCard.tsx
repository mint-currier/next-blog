import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PostCardProps } from "@/types/post";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale/ja";

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow py-0">
      <Link href={`/posts/${post.id}`}>
        {post.topImage && (
          <div className="relative w-full h-48">
            <Image
              src={post.topImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-t-md"
              priority
            />
          </div>
        )}
        <CardHeader className="my-2 font-extrabold text-xl">
          <CardTitle className="line-clamp-2">{post.title}</CardTitle>
        </CardHeader>
        <CardContent className="my-2">
          <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
        </CardContent>
        <CardFooter className="my-2 flex justify-between items-center text-sm text-gray-600">
          <span>{post.author.name}</span>
          <time>
            {formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
              locale: ja,
            })}
          </time>
        </CardFooter>
      </Link>
    </Card>
  );
}
