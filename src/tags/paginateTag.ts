import {
    TagToken,
    TopLevelToken,
    Context,
    Emitter,
    Template,
  } from 'liquidjs';
  
  interface PaginateContext {
    page: number;
    per_page: number;
    item_count: number;
    pages: number;
    previous: number | null;
    next: number | null;
  }
  
  const paginateTag = {
    collectionName: '',
    pageSize: 0,
    templates: [] as Template[],
    liquid: null as any,
  
    parse(tagToken: TagToken, remainTokens: TopLevelToken[]) {
      const args = tagToken.args;
      const match = args.match(/(.*) by (\d+)/);
      if (match) {
        this.collectionName = match[1].trim();
        this.pageSize = parseInt(match[2], 10);
      } else {
        throw new Error(`Invalid paginate tag syntax: ${args}`);
      }
  
      this.templates = [];
      const stream = this.liquid.parser.parseStream(remainTokens);
      stream
        .on('tag:endpaginate', () => stream.stop())
        .on('template', (tpl: Template) => this.templates.push(tpl))
        .on('end', () => {
          throw new Error('tag "paginate" not closed');
        })
        .start();
    },
  
    async render(ctx: Context, emitter: Emitter) {
      const collection = await ctx.get([this.collectionName]);
  
      if (!Array.isArray(collection)) {
        throw new Error(`'${this.collectionName}' is not a collection`);
      }
  
      const itemCount = collection.length;
      const pageValue = await ctx.get(['page']);
      const page = parseInt(pageValue ? String(pageValue) : '1', 10);
      const pages = Math.ceil(itemCount / this.pageSize);
      const offset = (page - 1) * this.pageSize;
      const paginatedItems = collection.slice(offset, offset + this.pageSize);
  
      const paginate: PaginateContext = {
        page: page,
        per_page: this.pageSize,
        item_count: itemCount,
        pages: pages,
        previous: page > 1 ? page - 1 : null,
        next: page < pages ? page + 1 : null,
      };
  
      ctx.push({ paginate });
      ctx.push({ [this.collectionName]: paginatedItems });
  
      for (const tpl of this.templates) {
        await tpl.render(ctx, emitter);
      }
  
      ctx.pop();
      ctx.pop();
    },
  };
  
  export default paginateTag;
  