module.exports = {
  parse: function (tagToken) {
    this.str = tagToken.args; 
  },
  render: async function (ctx) {
    const content = await ctx.get(this.str);
    return content.toUpperCase();
  },
};