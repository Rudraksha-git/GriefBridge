import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full flex flex-col items-center">
        <SignUp 
          path="/sign-up" 
          routing="path" 
          signInUrl="/sign-in" 
          fallbackRedirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}
