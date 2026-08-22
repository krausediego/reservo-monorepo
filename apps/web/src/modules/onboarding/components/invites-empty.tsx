import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useQueryClient } from "@tanstack/react-query";
import { RotateCw, UserRoundX } from "lucide-react";
import { onboardingInvitationsKeys } from "../onboarding-invitations.keys";

export function InvitesEmpty() {
  const queryClient = useQueryClient();

  const handleRefreshInvites = () => {
    queryClient.resetQueries({
      queryKey: onboardingInvitationsKeys.invitations(),
    });
  };

  return (
    <Empty className="p-4">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UserRoundX />
        </EmptyMedia>
        <EmptyTitle>Sem convites</EmptyTitle>
        <EmptyDescription>
          Contate um administrador de um estabelecimento para enviar seu convite
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={handleRefreshInvites} variant="outline" size="sm">
          <RotateCw />
          Recarregar
        </Button>
      </EmptyContent>
    </Empty>
  );
}
