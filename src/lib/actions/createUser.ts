"use server";

import { registerUserSchema } from "@/validations/user";
import { ZodError } from "zod";
import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import { signIn } from "../auth";
import { redirect } from "next/navigation";

type ActionState = {
  success: boolean;
  errors: Record<string, string[]>;
}

export async function createUser(prevState: ActionState, formData: FormData) : Promise<ActionState>{
  // フォーム情報取得
  const rawFormData = Object.fromEntries(
    ["name", "email", "password", "confirmPassword"].map((key) => [key, formData.get(key)])
  ) as Record<string, string>;

  // バリデーション
  const validationResult = registerUserSchema.safeParse(rawFormData);
  if (!validationResult.success) {
    return handleValidationError(validationResult.error);
  }

  // DBにメールアドレスが存在しているか確認
  const user = await prisma.user.findUnique({
    where: { email: rawFormData.email },
  });
  if (user) {
    return handleError({ email: ["このメールアドレスは既に使用されています。"] });
  }

  // 存在していなければ、DBにユーザーを作成
  const hashedPassword = await bcryptjs.hash(rawFormData.password, 12);
  const newUser = await prisma.user.create({
    data: {
      name: rawFormData.name,
      email: rawFormData.email,
      password: hashedPassword,
    },
  });
  if (!newUser) {
    return handleError({ form: ["ユーザーの作成に失敗しました。"] });
  }

  // dashboardにリダイレクト
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirect: false,
    });
    redirect("/dashboard"); 

}

function handleValidationError(error : ZodError) : ActionState {
  const { fieldErrors, formErrors } = error.flatten();
  if (formErrors.length > 0) {
    return {
      success: false,
      errors: { 
        ...fieldErrors,
        form: formErrors },
    }
  }
  return {
    success: false,
    errors: fieldErrors as Record<string, string[]>,
  };
}

function handleError(customErros: Record<string, string[]>) : ActionState {
  return {
    success: false,
    errors: customErros,
  };
}