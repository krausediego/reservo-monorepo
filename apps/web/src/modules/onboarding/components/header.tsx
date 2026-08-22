import { Zap } from "lucide-react";

export function OnboardingHeader() {
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <div className="p-2 rounded-md flex justify-center items-center bg-primary">
        <Zap className="size-6 text-primary-foreground" />
      </div>

      <h1 className="text-3xl font-bold">Bem-vindo</h1>
      <p className="text-muted-foreground text-center lg:text-start">
        Aceite um convite ou crie seu estabelecimento para começar
      </p>
    </div>
  );
}
