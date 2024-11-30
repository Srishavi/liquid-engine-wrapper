import { TagToken, Context } from 'liquidjs';

const upperCaseTag = {
  str: '', 

  parse(tagToken: TagToken) {
    this.str = tagToken.args.trim(); 
  },

  async render(ctx: Context) {
    const content = ctx.get([this.str]); 
    return String(content || '').toUpperCase(); 
  },
};

export default upperCaseTag;
