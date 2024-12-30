import { Liquid } from "liquidjs"
import moneyFilter from "./filters/moneyFilter.js"
import { assetUrlFilter } from "./filters/assetUrlFilter.js"
import { stylesheetTagFilter } from "./filters/stylesheetTagFilter.js"
import upperCaseTag from "./tags/upperCaseTag.js"
import paginateTag from "./tags/paginateTag.js"
import styleBlock from "./tags/styleBlock.js"
import sectionTag from "./tags/sectionTag.js"
import sectionsTag from "./tags/sectionsTag.js"
import renderTag from "./tags/renderTag.js"

class RenderingEngine {
  private engine: Liquid
  private baseUrl: string

  constructor(baseUrl: string) {
    if (!baseUrl) {
      throw new Error("Base URL is required")
    }
    this.baseUrl = baseUrl
    this.engine = new Liquid()
    this.engine.registerFilter("money", moneyFilter)
    this.engine.registerFilter("asset_url", assetUrlFilter)
    this.engine.registerFilter("stylesheet_tag", stylesheetTagFilter)
    this.engine.registerTag("uppercase", upperCaseTag)
    this.engine.registerTag("paginate", paginateTag)
    this.engine.registerTag("style", styleBlock)
    this.engine.registerTag("section", sectionTag)
    this.engine.registerTag("sections", sectionsTag)
    this.engine.registerTag("render", renderTag)
  }

  async render(template: string, data: Record<string, any> = {}): Promise<string> {
    return this.engine.parseAndRender(template, {
      ...data,
      __baseUrl__: this.baseUrl,
      __engine__: this,
      __fetch__: async (url: string) => {
        const resp = await fetch(url)
        if (!resp.ok) {
          throw new Error(`Failed to fetch ${url}. Status: ${resp.status}`)
        }
        return resp.text()
      },
    })
  }

  parse(template: string): void {
    this.engine.parse(template)
  }
}

export default RenderingEngine
