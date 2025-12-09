export function firstOrSecond(text: string, countryCode: string): string {
  const delimiter = '###';
  
  if (!text.includes(delimiter)) {
    return text;
  }

  const parts = text.split(delimiter);
  
  // parts[0] = uz, parts[1] = ru, parts[2] = en
  if (countryCode === 'uz') {
    return parts[0] || text;
  } else if (countryCode === 'ru') {
    return parts[1] || parts[0] || text;
  } else if (countryCode === 'en') {
    return parts[2] || parts[0] || text;
  }
  
  // Default to first part (uz)
  return parts[0] || text;
}