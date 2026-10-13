import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BadgeCheck,
  CirclePause,
  Clock,
  LayoutGrid,
  TrendingUp,
} from "lucide-react";
import { useOverviewServiceQuery } from "../hooks/use-overview-service-query";
import { format } from "date-fns";

export function ServicesOverview() {
  const { data: overviewService, dataUpdatedAt } = useOverviewServiceQuery();

  const formattedAvgPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(overviewService?.avgPrice ? overviewService.avgPrice / 100 : 0);

  const formattedPercentActive = new Intl.NumberFormat("pt-BR", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(
    overviewService?.totalServices
      ? overviewService.totalActiveServices / overviewService.totalServices
      : 0,
  );

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>TOTAL CADASTRADO</CardTitle>
          <CardAction className="bg-muted p-2 rounded-md">
            <LayoutGrid />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <h1 className="text-3xl">{overviewService?.totalServices}</h1>
            <p className="text-muted-foreground">serviços</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-slate-500" />
            <p className="text-xs font-medium">
              Atualizado em: {format(dataUpdatedAt, "dd/MM/yyyy HH:mm:ss")}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ATIVOS PARA RESERVA</CardTitle>
          <CardAction className="bg-emerald-400/30 p-2 rounded-md">
            <BadgeCheck className="text-emerald-500" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <h1 className="text-3xl text-emerald-500 font-semibold">
              {overviewService?.totalActiveServices}
            </h1>
            <p className="text-emerald-500">
              {formattedPercentActive} do catálogo
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-emerald-500" />
            <p className="text-xs font-medium text-emerald-500">
              Visíveis no aplicativo
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PAUSADOS / INATIVOS</CardTitle>
          <CardAction className="bg-rose-400/30 p-2 rounded-md">
            <CirclePause className="text-rose-400" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <h1 className="text-3xl text-rose-400/60">
              {overviewService?.totalInactiveServices}
            </h1>
            <p className="text-muted-foreground">não visíveis</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-rose-400 animate-pulse" />
            <p className="text-xs font-medium">Requer revisão técnica</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>TEMPO MÉDIO DE SESSÃO</CardTitle>
          <CardAction className="bg-emerald-400/30 p-2 rounded-md">
            <Clock className="text-emerald-500" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <h1 className="text-3xl">{overviewService?.avgDuration}</h1>
            <p className="text-muted-foreground">min / atendimento</p>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="size-4 text-emerald-500" />
            <p className="text-xs font-medium">
              Ticket médio {formattedAvgPrice}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
