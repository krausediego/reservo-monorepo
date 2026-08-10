import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

export function NavigateToSignIn() {
  const navigate = useNavigate();

  return (
    <Button
      className="absolute top-10 right-10"
      variant="secondary"
      onClick={() => navigate({ to: "/sign-in" })}
    >
      Login
    </Button>
  );
}
