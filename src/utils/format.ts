const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
});

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatDate(value: string): string {
  return dateFormatter.format(new Date(value));
}

export function formatDateTime(value: string): string {
  return dateTimeFormatter.format(new Date(value));
}

export function formatWeight(value: number): string {
  return `${value.toFixed(1).replace('.', ',')} kg`;
}

// Normaliza texto para login: remove acentos, espaços extras e transforma em minúsculas.
export function normalizeLoginText(value: string): string {
  return value
    .normalize('NFD') // separa acentos
    .replace(/\p{Diacritic}/gu, '') // remove marcas diacríticas
    .toLowerCase()
    .replace(/\s+/g, '');
}
