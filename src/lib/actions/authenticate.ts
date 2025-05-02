"use server";

import { redirect } from "next/navigation";
import { signIn } from "../auth";
import { AuthError, CredentialsSignin} from "next-auth";

export async function authenticateCredentials(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirect: false,
    });
    redirect("/dashboard");

  } catch (error) {
    if (error instanceof AuthError) {
      console.log("Error during signIn:", error);
      if (error instanceof CredentialsSignin) {
        return "メールアドレスまたはパスワードが正しくありません。";
      }
      return "認証エラーが発生しました。";
    }
    throw error;
  }
}

export async function authenticateGitHub() {
  try {
    await signIn("github");
    redirect("/dashboard");

  } catch (error) {
    if (error instanceof AuthError) {
      console.log("Error during signIn:", error);
      return "認証エラーが発生しました。";
    }
    throw error;    
  }
}