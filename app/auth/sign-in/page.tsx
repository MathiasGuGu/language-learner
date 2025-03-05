import { SignInForm } from "./sign-in-form";

export default function SignInPage() {
  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Welcome back</h1>
        <p className="text-gray-600">
          Sign in to your learner account to continue
        </p>
      </div>
      <SignInForm className="w-1/3" />
    </main>
  );
}
