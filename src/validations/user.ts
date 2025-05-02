import { z } from 'zod';
export const registerUserSchema = z.object({
  name: z.string()
    .min(1, { message: "名前は必須です。"}),
  email: z.string()
    .min(1, { message: "メールアドレスは必須です。" })
    .email({ message: "無効なメールアドレスです。" }),
  password: z.string()
    .min(8, { message: "パスワードは8文字以上である必要があります。" }),
  confirmPassword: z.string()
    .min(1, { message: "パスワードの確認は必須です。" }),

}).refine((data) => data.password === data.confirmPassword, {
  message: "パスワードが一致しません。",
  path: ["confirmPassword"], // path of error

});