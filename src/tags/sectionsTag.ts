import { TagToken, TopLevelToken, Context, Emitter } from "liquidjs"

interface SectionsTag {
  groupName: string
  parse(token: TagToken, remainTokens: TopLevelToken[]): void
  render(ctx: Context, emitter: Emitter): Promise<void>
}

const sectionsTag: SectionsTag = {
  groupName: "",

  parse(token: TagToken) {
    this.groupName = token.args.trim().replace(/['"]/g, "")
  },

  async render(ctx: Context, emitter: Emitter) {
    const env = ctx.environments as any
    const baseUrl = env.__baseUrl__ || ""
    const engine = env.__engine__
    const fetchFn = env.__fetch__
    if (!baseUrl || !engine || !fetchFn) return

    try {
      const jsonUrl = `${baseUrl}/sections/${this.groupName}`
      const jsonStr = await fetchFn(jsonUrl)
      if (!jsonStr || !jsonStr.trim()) {
        emitter.write(`<!-- sections '${this.groupName}' is empty or not found -->`)
        return
      }

      const groupConfig = JSON.parse(jsonStr)
      if (!groupConfig.sections || !groupConfig.order) {
        emitter.write(`<!-- sections '${this.groupName}' missing 'sections' or 'order' -->`)
        return
      }

      let finalOutput = ""
      for (const sectionId of groupConfig.order) {
        const subSection = groupConfig.sections[sectionId]
        if (!subSection?.type) continue

        const subUrl = `${baseUrl}/sections/${subSection.type}`
        const subStr = await fetchFn(subUrl)
        if (!subStr || !subStr.trim()) continue

        finalOutput += await engine.render(subStr, {
          ...ctx.getAll(),
          section: subSection,
        })
      }
      emitter.write(finalOutput)
    } catch (err: any) {
      emitter.write(`<!-- Failed to render section group '${this.groupName}': ${String(err)} -->`)
    }
  },
}

export default sectionsTag
