export function assetUrlFilter(input: string): string {
    const assetBase = process.env.ASSET_BASE_URL || "/assets"
    const baseTrimmed = assetBase.replace(/\/+$/, "")
    const inputTrimmed = input.replace(/^\/+/, "")
    return `${baseTrimmed}/${inputTrimmed}`
  }
  