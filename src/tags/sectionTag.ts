import { TagToken, TopLevelToken, Context, Emitter } from "liquidjs"

interface SectionTag {
  sectionName: string
  parse(token: TagToken, remainTokens: TopLevelToken[]): void
  render(ctx: Context, emitter: Emitter): Promise<void>
}

const sectionTag: SectionTag = {
  sectionName: "",

  parse(token: TagToken) {
    this.sectionName = token.args.trim().replace(/['"]/g, "")
  },

  async render(ctx: Context, emitter: Emitter) {
    const env = ctx.environments as any
    const baseUrl = env.__baseUrl__ || ""
    const engine = env.__engine__
    const fetchFn = env.__fetch__

    if (!baseUrl || !engine || !fetchFn) return

    try {
      const liquidUrl = `${baseUrl}/sections/${this.sectionName}`
      const liquidStr = await fetchFn(liquidUrl)
      if (!liquidStr || !liquidStr.trim()) {
        emitter.write(`<!-- section '${this.sectionName}' is empty/not found -->`)
        return
      }

      const rendered = await engine.render(liquidStr, ctx.getAll())
      emitter.write(rendered)
    } catch (err: any) {
      emitter.write(`<!-- Failed to render section '${this.sectionName}': ${String(err)} -->`)
    }
  },
}

export default sectionTag
