import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Marker, MarkerContent } from "@/components/ui/marker";
import {
  CreateEstablishmentDialog,
  InvitesSkeleton,
  OnboardingHeader,
  OnboardingInvites,
} from "@/modules/onboarding/components";
import { CreateEstablishmentProvider } from "@/modules/onboarding/contexts";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/_onboarding/onboarding/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container m-auto">
      <div className="flex flex-col items-center space-y-6 px-4">
        <OnboardingHeader />

        <Suspense fallback={<InvitesSkeleton />}>
          <OnboardingInvites />
        </Suspense>

        <Marker className="max-w-150" variant="separator">
          <MarkerContent>ou</MarkerContent>
        </Marker>

        <Dialog>
          <DialogTrigger
            render={
              <Button className="w-full max-w-150" size="lg" variant="outline">
                Criar novo estabelecimento
              </Button>
            }
          />
          <DialogContent className="lg:min-w-2xl">
            <CreateEstablishmentProvider>
              <CreateEstablishmentDialog />
            </CreateEstablishmentProvider>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
