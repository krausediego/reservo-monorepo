import { Button } from "@/components/ui/button";
import { useInvites, useListMyInvitationsQuery } from "../hooks";
import { InvitesEmpty } from "./invites-empty";
import { Spinner } from "@/components/ui/spinner";
import { AlertPopover } from "@/components/alert-popover";

export function OnboardingInvites() {
  const { data: invitations } = useListMyInvitationsQuery();
  const {
    isAcceptInvitationPending,
    isRejectInvitationPending,
    handleAcceptInvitation,
    handleRejectInvitation,
  } = useInvites();

  return (
    <div className="w-full flex flex-col space-y-3">
      <p className="text-muted-foreground w-full max-w-150 mx-auto text-sm">
        Convites pendentes:
      </p>

      {invitations.length ? (
        invitations?.map((invitation) => {
          return (
            <div
              key={invitation.id}
              className="flex mx-auto items-center w-full max-w-150 bg-card justify-between py-4 px-4 rounded-lg border shadow-sm"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="bg-primary py-1.5 px-2 rounded-md">
                  <p>BA</p>
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm truncate">
                    {invitation.establishment.name}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    Convidado por:{" "}
                    <span className="text-accent-foreground">
                      {invitation.inviter.name}
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-x-2 flex items-center">
                <AlertPopover
                  title="Rejeitar este convite?"
                  description="Esta ação não poderá ser desfeita."
                  handleConfirm={() =>
                    handleRejectInvitation({ id: invitation.id })
                  }
                  isPending={isRejectInvitationPending}
                />

                <Button
                  disabled={isAcceptInvitationPending}
                  onClick={() => handleAcceptInvitation({ id: invitation.id })}
                >
                  {isAcceptInvitationPending && <Spinner />}
                  Aceitar
                </Button>
              </div>
            </div>
          );
        })
      ) : (
        <InvitesEmpty />
      )}
    </div>
  );
}
