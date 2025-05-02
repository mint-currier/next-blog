"use client";

import { useState, useActionState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updatePost } from "@/lib/actions/updatePost";

type EditPostFormProps = {
  post: {
    id: string;
    title: string;
    content: string;
    topImage?: string | null;
    published: boolean;
  };
};

export default function EditPostForm({ post }: EditPostFormProps) {
  const [content, setContent] = useState(post.content);
  const [contentLength, setContentLength] = useState(0);
  const [preview, setPreview] = useState(false);

  const [title, setTitle] = useState(post.title);
  const [published, setPublished] = useState(post.published);
  const [imagePreview, setImagePreiew] = useState(post.topImage);

  const handlerContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    setContentLength(value.length);
  };

  const handlerImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreiew(previewUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview !== post.topImage) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, post.topImage]);

  const [state, formAction, isPending] = useActionState(updatePost, {
    success: false,
    errors: {},
  });

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">編集</h1>
      <form className="space-y-4" action={formAction}>
        <input type="hidden" name="postId" value={post.id} />
        <input type="hidden" name="oldImageUrl" value={post.topImage || ""} />
        <div>
          <Label htmlFor="title" className="py-2">
            タイトル
          </Label>
          <Input
            type="text"
            id="title"
            name="title"
            placeholder="タイトルを入力してください。"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></Input>
          {state.errors.title && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.title.join(",")}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="topImage" className="py-2">
            トップ画像
          </Label>
          <Input
            type="file"
            id="topImage"
            name="topImage"
            accept="image/*"
            onChange={handlerImageChange}
          ></Input>
          {imagePreview && (
            <div className="mt-2">
              <Image
                src={imagePreview}
                alt={post.title}
                width={0}
                height={0}
                sizes="200px"
                className="w-[200px]"
                priority
              />
            </div>
          )}
          {state.errors.topImage && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.topImage.join(",")}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="content" className="py-2">
            内容（Markdown）
          </Label>
          <TextareaAutosize
            id="content"
            name="content"
            className="w-full border p-2"
            minRows={8}
            placeholder="Markdown形式で入力してください。"
            value={content}
            onChange={handlerContentChange}
          ></TextareaAutosize>
          {state.errors.content && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.content.join(",")}
            </p>
          )}
        </div>
        <div className="text-right text-sm text-gray-500 mt-1">
          文字数: {contentLength}
        </div>
        <div>
          <Button type="button" onClick={() => setPreview(!preview)}>
            {preview ? "プレビューを閉じる" : "プレビューを表示"}
          </Button>
        </div>
        {preview && (
          <div className="border p-4 bg-gray-50 prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              skipHtml={false}
              unwrapDisallowed={true}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
        <RadioGroup
          name="published"
          defaultValue={published.toString()}
          onValueChange={(value) => setPublished(value === "true")}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="published" />
            <Label htmlFor="published">表示</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="non-published" />
            <Label htmlFor="non-published">非表示</Label>
          </div>
        </RadioGroup>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          更新する
        </Button>
      </form>
    </div>
  );
}
