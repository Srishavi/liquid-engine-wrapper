// sectionsTag.ts
import { TagToken, TopLevelToken, Template, Context, Emitter } from "liquidjs"

interface CustomEnv {
  __baseUrl__?: string
  __engine__?: any
  __fetch__?: (url: string) => Promise<string>
}

interface SectionsTag {
  sectionName: string
  liquid?: any
  parse(tagToken: TagToken, remainTokens: TopLevelToken[]): void
  render(ctx: Context, emitter: Emitter): Promise<void>
}

const sectionsTag: SectionsTag = {
  sectionName: "",

  parse(tagToken: TagToken) {
    this.sectionName = tagToken.args.trim().replace(/['"]/g, "")
  },

  async render(ctx: Context, emitter: Emitter) {
    const env = ctx.environments as unknown as CustomEnv
    const baseUrl = env.__baseUrl__ || ""
    const engine = env.__engine__
    const fetchFn = env.__fetch__
    if (!baseUrl || !engine || !fetchFn) return
    try {
      const url = `${baseUrl}/sections/${this.sectionName}`
      const sectionTemplateStr = await fetchFn(url)
      const rendered = await engine.render(sectionTemplateStr, ctx.getAll())
      emitter.write(rendered)
    } catch (e: any) {
      emitter.write(
        `<p>Failed to render section '${this.sectionName}': ${String(e)}</p>`
      )
    }
  },
}

export default sectionsTag
