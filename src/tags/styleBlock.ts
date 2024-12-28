// styleBlock.ts
import {
    TagToken,
    TopLevelToken,
    Template,
    Context,
    Emitter
  } from "liquidjs"
  
  interface StyleBlock {
    templates?: Template[]
    liquid?: any
    parse(tagToken: TagToken, remainTokens: TopLevelToken[]): void
    render(ctx: Context, emitter: Emitter): Promise<void>
  }
  
  const styleBlock: StyleBlock = {
    parse(tagToken: TagToken, remainTokens: TopLevelToken[]) {
      (this as StyleBlock).templates = []
      const stream = (this as StyleBlock).liquid.parser.parseStream(remainTokens)
      stream
        .on("tag:endstyle", () => stream.stop())
        .on("template", (tpl: Template) => {
          (this as StyleBlock).templates?.push(tpl)
        })
        .on("end", () => {
          throw new Error("tag 'style' not closed")
        })
        .start()
    },
  
    async render(ctx: Context, emitter: Emitter) {
      const templates = (this as StyleBlock).templates || []
      emitter.write("<style>")
      for (const tpl of templates) {
        emitter.write(await tpl.render(ctx, emitter))
      }
      emitter.write("</style>")
    }
  }
  
  export default styleBlock
  