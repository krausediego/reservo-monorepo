/**
 * Geocoding de endereços brasileiros via Nominatim (OSM), busca estruturada.
 *
 * Por que não usar CEP -> coordenada (BrasilAPI v2, AwesomeAPI):
 * essas APIs nunca veem o número. O melhor que podem devolver é o centroide
 * do segmento de rua do CEP. Aqui mandamos rua + número, que é o que dá
 * precisão de porta onde o OSM tem o dado.
 */

export type AddressInput = {
  street: string;
  number?: string;
  neighborhood?: string;
  city: string;
  state: string; // UF
  postalCode?: string;
};

export type Precision = "exact" | "street" | "area";

export type GeocodeResult = {
  lat: number;
  lng: number;
  precision: Precision;
  label: string;
  /** Qual tentativa da cascata resolveu — útil para log/debug. */
  matchedOn: string;
};

const NOMINATIM = "https://nominatim.openstreetmap.org/search";

/** Identifique sua aplicação. Exigido pela policy de uso do Nominatim. */
const USER_AGENT = "SeuApp/1.0 (contato@seudominio.com.br)";

/**
 * Logradouro dos Correios vem com sufixos de faixa que quebram o geocoder:
 * "Avenida Osmani Barbosa - até 1715 - lado ímpar"
 * "Rua XV de Novembro - de 1200 a 1500"
 */
export const cleanStreet = (street: string): string =>
  street
    .replace(/\s*[-–]\s*(até|de|do km|lote)\b.*$/i, "")
    .replace(/\s*[-–]\s*lado\s+(par|ímpar|impar)\b.*$/i, "")
    .replace(/\s*\(.*?\)\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

type NominatimItem = {
  lat: string;
  lon: string;
  display_name: string;
  addresstype?: string;
  category?: string;
  type?: string;
};

const precisionOf = (item: NominatimItem): Precision => {
  const kind = item.addresstype ?? item.type ?? "";
  if (["building", "house", "amenity", "shop", "office"].includes(kind)) {
    return "exact";
  }
  if (["road", "street", "residential", "highway"].includes(kind)) {
    return "street";
  }
  return "area";
};

/** A policy do Nominatim é de 1 req/s. Serializa as chamadas. */
let queue: Promise<unknown> = Promise.resolve();

const throttled = <T>(fn: () => Promise<T>): Promise<T> => {
  const run = queue.then(fn, fn);
  queue = run.then(
    () => new Promise((r) => setTimeout(r, 1100)),
    () => new Promise((r) => setTimeout(r, 1100)),
  );
  return run;
};

const query = async (
  params: Record<string, string>,
  signal?: AbortSignal,
): Promise<NominatimItem | null> => {
  const url = new URL(NOMINATIM);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "br");
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }

  return throttled(async () => {
    const res = await fetch(url, {
      signal,
      headers: {
        "User-Agent": USER_AGENT,
        "Accept-Language": "pt-BR",
      },
    });
    if (!res.ok) return null;
    const [first] = (await res.json()) as NominatimItem[];
    return first ?? null;
  });
};

/**
 * Cascata: do mais específico ao mais genérico. Para na primeira que resolver,
 * e devolve `precision` para a UI poder avisar quando o resultado é grosseiro.
 *
 * IMPORTANTE: na busca estruturada, `street` recebe "numero nome-da-rua".
 * Não existe parâmetro separado para número de porta.
 */
export const geocodeAddress = async (
  address: AddressInput,
  signal?: AbortSignal,
): Promise<GeocodeResult | null> => {
  const street = cleanStreet(address.street);
  const city = address.city.trim();
  const state = address.state.trim();
  const number = address.number?.trim();

  const attempts: Array<[string, Record<string, string>]> = [];

  // 1. rua + número + CEP -> precisão de porta
  if (number && address.postalCode) {
    attempts.push([
      "street+number+postalcode",
      {
        street: `${number} ${street}`,
        city,
        state,
        postalcode: address.postalCode.replace(/\D/g, ""),
      },
    ]);
  }

  // 2. rua + número (sem CEP; o CEP às vezes conflita com o polígono do OSM)
  if (number) {
    attempts.push([
      "street+number",
      { street: `${number} ${street}`, city, state },
    ]);
  }

  // 3. só a rua -> centroide do segmento
  attempts.push(["street", { street, city, state }]);

  // 4. bairro -> área
  if (address.neighborhood) {
    attempts.push([
      "neighborhood",
      { q: `${address.neighborhood}, ${city}, ${state}, Brasil` },
    ]);
  }

  // 5. cidade -> último recurso, só para o mapa não abrir no oceano
  attempts.push(["city", { city, state }]);

  for (const [matchedOn, params] of attempts) {
    const item = await query(params, signal);
    if (!item) continue;

    return {
      lat: Number(item.lat),
      lng: Number(item.lon),
      precision: precisionOf(item),
      label: item.display_name,
      matchedOn,
    };
  }

  return null;
};

/**
 * Fallback para quando o Nominatim não encontra nada.
 * Photon é baseado em OSM, tolera erro de digitação e não exige chave.
 * Aceita viés geográfico por lat/lon, o que melhora muito o ranking.
 */
export const geocodeFuzzy = async (
  text: string,
  bias?: { lat: number; lng: number },
  signal?: AbortSignal,
): Promise<GeocodeResult | null> => {
  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", text);
  url.searchParams.set("limit", "1");
  url.searchParams.set("lang", "default");
  if (bias) {
    url.searchParams.set("lat", String(bias.lat));
    url.searchParams.set("lon", String(bias.lng));
  }

  const res = await fetch(url, { signal });
  if (!res.ok) return null;

  const json = (await res.json()) as {
    features: Array<{
      geometry: { coordinates: [number, number] };
      properties: { osm_value?: string; name?: string; city?: string };
    }>;
  };

  const [feature] = json.features ?? [];
  if (!feature) return null;

  const [lng, lat] = feature.geometry.coordinates;
  const value = feature.properties.osm_value ?? "";

  return {
    lat,
    lng,
    precision: value === "house" ? "exact" : value ? "street" : "area",
    label: [feature.properties.name, feature.properties.city]
      .filter(Boolean)
      .join(", "),
    matchedOn: "photon",
  };
};
