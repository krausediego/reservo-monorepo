/**
 * Utilitários de CEP.
 *
 * Importante: CEP NÃO tem dígito verificador. Não existe validação offline
 * capaz de dizer se um CEP existe — só se ele tem o formato certo.
 * Para saber se existe de fato, consulte a API (ver `checkCepExists`).
 */

/** Remove tudo que não for dígito. Use antes de enviar para qualquer API. */
export const normalizeCep = (value: string): string => value.replace(/\D/g, "");

/** Formata para 00000-000. Retorna parcial enquanto o usuário digita. */
export const formatCep = (value: string): string => {
  const digits = normalizeCep(value).slice(0, 8);
  return digits.length > 5
    ? `${digits.slice(0, 5)}-${digits.slice(5)}`
    : digits;
};

/**
 * Sequências repetidas (00000000, 11111111...) passam em qualquer regex de
 * formato, mas nenhuma delas é um CEP alocado. Vale barrar.
 */
const isRepeated = (digits: string): boolean => /^(\d)\1{7}$/.test(digits);

export const isValidCep = (value: string | null | undefined): boolean => {
  if (!value) return false;
  const digits = normalizeCep(value);
  return digits.length === 8 && !isRepeated(digits);
};

/**
 * A primeira posição indica a região postal (0 a 9).
 * Útil para uma checagem grosseira de coerência com a UF antes de bater na API.
 */
export const REGION_BY_FIRST_DIGIT: Record<string, string[]> = {
  "0": ["SP"],
  "1": ["SP"],
  "2": ["RJ", "ES"],
  "3": ["MG"],
  "4": ["BA", "SE"],
  "5": ["PE", "AL", "PB", "RN"],
  "6": ["CE", "PI", "MA", "PA", "AP", "AM", "RR", "AC"],
  "7": ["DF", "GO", "TO", "MT", "MS", "RO"],
  "8": ["PR", "SC"],
  "9": ["RS"],
};

/** Coerência entre CEP e UF. Não prova que o CEP existe, mas pega troca de campo. */
export const matchesState = (cep: string, uf: string): boolean => {
  const digits = normalizeCep(cep);
  if (digits.length !== 8) return false;
  return REGION_BY_FIRST_DIGIT[digits[0]]?.includes(uf.toUpperCase()) ?? false;
};

/** Validação real: só a base dos Correios sabe. Devolve o endereço ou null. */
export const checkCepExists = async (
  cep: string,
  signal?: AbortSignal,
): Promise<{ street: string; city: string; state: string } | null> => {
  if (!isValidCep(cep)) return null;

  const res = await fetch(
    `https://brasilapi.com.br/api/cep/v1/${normalizeCep(cep)}`,
    { signal },
  );
  if (!res.ok) return null;

  const data = (await res.json()) as {
    street?: string;
    city?: string;
    state?: string;
  };

  return {
    street: data.street ?? "",
    city: data.city ?? "",
    state: data.state ?? "",
  };
};
