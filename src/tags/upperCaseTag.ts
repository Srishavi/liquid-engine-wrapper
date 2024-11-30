import { TagToken, Context, TagImplOptions } from 'liquidjs';

interface UpperCaseTag extends TagImplOptions {
  str: string;
}

const upperCaseTag: UpperCaseTag = {
  parse(tagToken: TagToken) {
    this.str = tagToken.args;
  },
  async render(ctx: Context) {
    const content = await ctx.get(this.str);
    return String(content).toUpperCase();
  },
};

export default upperCaseTag;
