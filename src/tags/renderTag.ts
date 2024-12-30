import { TagToken, TopLevelToken, Context, Emitter, Liquid } from "liquidjs"

interface RenderTag {
  snippetName: string
  snippetParams: Record<string, string>
  parse(tagToken: TagToken, remainTokens: TopLevelToken[]): void
  render(ctx: Context, emitter: Emitter): Promise<void>
}

async function evaluateExpressionViaLiquid(
  expr: string,
  engine: Liquid,
  contextData: Record<string, any>
): Promise<any> {
  const tinyTemplate = `{{ ${expr} | json }}`
  const parsed = engine.parse(tinyTemplate);
  const rendered = await engine.render(parsed, contextData);
  try {
    return JSON.parse(rendered)
  } catch {
    return rendered
  }
}

const renderTag: RenderTag = {
  snippetName: "",
  snippetParams: {},

  parse(tagToken: TagToken) {
    const snippetNameMatch = tagToken.args.match(/^(['"])([^'"]+)\1/)
    if (!snippetNameMatch) {
      throw new Error(`Invalid snippet name in render tag: '${tagToken.args}'`)
    }
    this.snippetName = snippetNameMatch[2].trim()

    const rest = tagToken.args.slice(snippetNameMatch[0].length).trim()
    if (!rest.startsWith(",")) {
      this.snippetParams = {}
      return
    }

    const paramStr = rest.replace(/^,/, "").trim()
    const paramPairs = paramStr.split(",").map((s) => s.trim())
    const paramsObj: Record<string, string> = {}

    for (const pair of paramPairs) {
      const colonIndex = pair.indexOf(":")
      if (colonIndex === -1) continue
      const key = pair.slice(0, colonIndex).trim()
      const value = pair.slice(colonIndex + 1).trim()
      paramsObj[key] = value
    }

    this.snippetParams = paramsObj
  },

  async render(ctx: Context, emitter: Emitter) {
    const env = ctx.environments as any
    const baseUrl = env.__baseUrl__ || ""
    const engine: Liquid | undefined = env.__engine__
    const fetchFn: ((url: string) => Promise<string>) | undefined = env.__fetch__

    if (!baseUrl || !engine || !fetchFn) {
      emitter.write(`<p>Rendering environment is not properly configured.</p>`)
      return
    }

    try {
      const snippetUrl = `${baseUrl}/snippets/${this.snippetName}`
      const snippetContent = await fetchFn(snippetUrl)

      const subContext = { ...ctx.getAll() } as Record<string, any>

      for (const [paramKey, rawExpr] of Object.entries(this.snippetParams)) {
        const val = await evaluateExpressionViaLiquid(rawExpr, engine, subContext)
        subContext[paramKey] = val
      }

      const parsed = engine.parse(snippetContent);
      const rendered = await engine.render(parsed, subContext);
      emitter.write(rendered)
    } catch (error: any) {
      emitter.write(
        `<p>Failed to render snippet '${this.snippetName}': ${String(error)}</p>`
      )
    }
  },
}

export default renderTag
