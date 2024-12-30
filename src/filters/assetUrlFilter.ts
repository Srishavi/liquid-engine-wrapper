export function assetUrlFilter(input: string, baseUrl: string): string {
  const assetBase = `${baseUrl || process.env.ASSET_BASE_URL || ""}/assets`;
  const baseTrimmed = assetBase.replace(/\/+$/, ""); 
  const inputTrimmed = input.replace(/^\/+/, "").replace(/\.[^/.]+$/, "");
  return `${baseTrimmed}/${inputTrimmed}`;
}
