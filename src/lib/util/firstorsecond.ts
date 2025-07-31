export function firstOrSecond(text: string, getFirst: boolean): string {
  const delimiter = '###';
  const index = text.indexOf(delimiter);

  if (index === -1) {
    return text;
  }

  const firstPart = text.substring(0, index);
  const secondPart = text.substring(index + delimiter.length);

  return getFirst ? firstPart : secondPart;
}