import { SignUpForm } from "./sign-up-form";

export default function SignUpPage() {
  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Welcome</h1>
      </div>
      <SignUpForm className="w-1/3" />
    </main>
  );
}
