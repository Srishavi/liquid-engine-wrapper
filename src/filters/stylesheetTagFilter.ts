export function stylesheetTagFilter(inputUrl: string): string {
    if (!inputUrl || typeof inputUrl !== "string") return ""
    return `<link rel="stylesheet" type="text/css" media="all" href="${inputUrl}">`
  }
  