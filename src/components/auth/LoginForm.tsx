"use client";

import { useActionState } from "react";
import { authenticateCredentials } from "@/lib/actions/authenticate";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticateCredentials,
    undefined
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-sm text-gray-500 mb-4">
          メールアドレスでログイン
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="address@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <Input type="password" name="password" id="password" required />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            ログイン
          </Button>
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
