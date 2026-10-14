import type { IOverviewServiceSchema } from "@reservo/types";
import { format } from "date-fns";
import {
  BadgeCheck,
  CirclePause,
  Clock,
  LayoutGrid,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

interface OverviewData {
  title: string;
  icon: LucideIcon;
  number: number;
  relation: string;
  description: React.ReactNode;
}

export function getOverviewInfos(
  overview: IOverviewServiceSchema.GetResponse,
  dataUpdatedAt: number,
): OverviewData[] {
  const formattedAvgPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(overview.avgPrice / 100);

  const formattedPercentActive = new Intl.NumberFormat("pt-BR", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(overview.totalActiveServices / overview.totalServices);

  return [
    {
      title: "Total cadastrado",
      icon: LayoutGrid,
      number: overview.totalServices,
      relation: "serviços",
      description: (
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-primary" />
          <p className="text-xs font-medium text-muted-foreground">
            Atualizado em: {format(dataUpdatedAt, "dd/MM/yyyy HH:mm:ss")}
          </p>
        </div>
      ),
    },
    {
      title: "Ativos para reserva",
      icon: BadgeCheck,
      number: overview.totalActiveServices,
      relation: `${formattedPercentActive} do catálogo`,
      description: (
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-emerald-500 dark:bg-emerald-700" />
          <p className="text-xs font-medium text-muted-foreground">
            Visíveis no aplicativo
          </p>
        </div>
      ),
    },
    {
      title: "Pausados / Inativos",
      icon: CirclePause,
      number: overview.totalInactiveServices,
      relation: "Não visíveis",
      description: (
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-rose-500 dark:bg-rose-700 animate-pulse" />
          <p className="text-xs font-medium text-muted-foreground">
            Requer revisão técnica
          </p>
        </div>
      ),
    },
    {
      title: "Tempo médio de sessão",
      icon: Clock,
      number: overview.avgDuration,
      relation: "min / atendimento",
      description: (
        <div className="flex items-center gap-1.5">
          <TrendingUp className="size-4 text-emerald-500 dark:text-emerald-700" />
          <p className="text-xs font-medium text-muted-foreground">
            Ticket médio {formattedAvgPrice}
          </p>
        </div>
      ),
    },
  ];
}
