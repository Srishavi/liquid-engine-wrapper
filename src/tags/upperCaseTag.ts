import { TagToken, Context, TagImplOptions } from 'liquidjs';

export const upperCaseTag: TagImplOptions = {
  parse(tagToken: TagToken) {
    this.variable = tagToken.args; 
  },
  async render(ctx: Context) {
    const val = await ctx.get(this.variable);
    if (typeof val !== 'string') return val;
    return val.toUpperCase();
  },
};
