"use server";

import { postSchema } from "@/validations/post";
import { saveImage } from "../image";
import prisma from "../prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

type ActionState = {
  success: boolean,
  errors: Record<string, string[]>
}

export async function createPost(prevState: ActionState, formData: FormData) : Promise<ActionState> {
  // フォームの情報を取得
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const topImageInput = formData.get("topImage");
  const topImage = topImageInput instanceof File ? topImageInput : null;

  // バリデーション
  const validationResult = postSchema.safeParse({title, content, topImage});
  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors
    }
  }

  // 画像保存
  console.log(topImage);
  const imageUrl = (topImage && topImage.size > 0) ? await saveImage(topImage) : null;
  if (topImage && topImage.size > 0 && !imageUrl) {
    return {
      success: false,
      errors: {
        topImage: ["画像の保存に失敗しました。"]
      }
    }
  }

  // DB登録
  const session = await auth();
  const userId = session?.user?.id;
  if (!session?.user?.email || !userId) {
    throw new Error("不正なリクエストです。");
  }

  await prisma.post.create({
    data: {
      title,
      content,
      topImage: imageUrl,
      published: true,
      authorId: userId
    }
  });

  redirect("/dashboard");
}