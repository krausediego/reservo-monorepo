// lib/currency.ts

type FormatCentsOptions = {
  /** Exibe "R$" antes do valor. Default: true */
  symbol?: boolean;
  /** Texto usado quando o valor é null/undefined/NaN. Default: "—" */
  fallback?: string;
  locale?: string;
  currency?: string;
};

const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(locale: string, currency: string, symbol: boolean) {
  const key = `${locale}:${currency}:${symbol}`;
  let formatter = formatterCache.get(key);

  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: symbol ? "currency" : "decimal",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    formatterCache.set(key, formatter);
  }

  return formatter;
}

export function formatCents(
  cents: number | string | null | undefined,
  options: FormatCentsOptions = {},
): string {
  const {
    symbol = true,
    fallback = "—",
    locale = "pt-BR",
    currency = "BRL",
  } = options;

  if (cents === null || cents === undefined || cents === "") return fallback;

  const value = typeof cents === "string" ? Number(cents) : cents;
  if (!Number.isFinite(value)) return fallback;

  return getFormatter(locale, currency, symbol).format(value / 100);
}

/** Centavos → número em reais. Útil para gráficos e somatórios de exibição. */
export function centsToUnits(cents: number): number {
  return cents / 100;
}

/** Reais → centavos, arredondando. Use só em fronteiras (import de CSV, etc.). */
export function unitsToCents(units: number): number {
  return Math.round(units * 100);
}
