export const parseCsv = (raw: string): string[][] => {
  return raw
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(',').map((value) => value.trim()));
};

export const fetchSheetCsv = async (url: string): Promise<string[][]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('No se pudo cargar la hoja.');
  }
  const text = await response.text();
  return parseCsv(text);
};
