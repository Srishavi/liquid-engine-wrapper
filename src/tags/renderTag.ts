import { TagToken, TopLevelToken, Template, Context, Emitter } from "liquidjs"

interface RenderTag {
  snippetName: string
  liquid?: any
  parse(tagToken: TagToken, remainTokens: TopLevelToken[]): void
  render(ctx: Context, emitter: Emitter): Promise<void>
}

const renderTag: RenderTag = {
  snippetName: "",

  parse(tagToken: TagToken) {
    this.snippetName = tagToken.args.trim().replace(/['"]/g, "")
  },

  async render(ctx: Context, emitter: Emitter) {
    const env = ctx.environments as any
    const baseUrl = env.__baseUrl__ || ""
    const engine = env.__engine__
    const fetchFn = env.__fetch__
    if (!baseUrl || !engine || !fetchFn) return
    try {
      const snippetUrl = `${baseUrl}/snippets/${this.snippetName}`
      const snippetContent = await fetchFn(snippetUrl)
      const rendered = await engine.render(snippetContent, ctx.getAll())
      emitter.write(rendered)
    } catch (e: any) {
      emitter.write(`<p>Failed to render snippet '${this.snippetName}': ${String(e)}</p>`)
    }
  },
}

export default renderTag
