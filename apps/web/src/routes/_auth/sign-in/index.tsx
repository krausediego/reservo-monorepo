import {
  NavigateToSignUp,
  SignInForm,
  SignInHeader,
} from "@/modules/auth/sign-in/components";
import { createFileRoute } from "@tanstack/react-router";
import { Zap } from "lucide-react";

export const Route = createFileRoute("/_auth/sign-in/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex w-full min-h-screen">
      <div className="w-full hidden items-center lg:flex justify-center bg-accent">
        <Zap className="size-20" />
      </div>
      <div className="w-full flex flex-col items-center justify-center gap-7 relative">
        <NavigateToSignUp />
        <SignInHeader />
        <SignInForm />
      </div>
    </div>
  );
}
