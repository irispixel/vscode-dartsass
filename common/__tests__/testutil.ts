export function getLocalSass(): string {
  const localSass = process.env.LOCALSASS || "/usr/local/bin/sass";
  return localSass;
}
