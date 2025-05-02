import GithubAuthForm from "@/components/auth/GithubAuthForm";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="container mx-auto flex h-screen items-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto justify-center">
        <GithubAuthForm />
        <LoginForm />
      </div>
    </div>
  );
}
