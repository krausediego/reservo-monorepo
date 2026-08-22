export type BrasilApiProps = {
  cep: string;
};

export type BrasilApiResponse = {
  cep: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  lat: string;
  lng: string;
  city_ibge: string;
  ddd: string;
};

export async function brasilApi({
  cep,
}: BrasilApiProps): Promise<BrasilApiResponse> {
  const res = await fetch(`https://cep.awesomeapi.com.br/json/${cep}`);
  const data = (await res.json()) as BrasilApiResponse;

  return data;
}
