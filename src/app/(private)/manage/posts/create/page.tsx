"use client";

import { useState, useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createPost } from "@/lib/actions/createPost";
import TextareaAutosize from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

export default function CreatePostPage() {
  const [content, setContent] = useState("");
  const [contentLength, setContentLength] = useState(0);
  const [preview, setPreview] = useState(false);

  const handlerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    setContentLength(value.length);
  };

  const [state, formAction, isPending] = useActionState(createPost, {
    success: false,
    errors: {},
  });

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">新規記事投稿</h1>
      <form className="space-y-4" action={formAction}>
        <div>
          <Label htmlFor="title" className="py-2">
            タイトル
          </Label>
          <Input
            type="text"
            id="title"
            name="title"
            placeholder="タイトルを入力してください。"
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
          ></Input>
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
            onChange={handlerChange}
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
        <Button
          type="submit"
          disabled={isPending}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          投稿する
        </Button>
      </form>
    </div>
  );
}
