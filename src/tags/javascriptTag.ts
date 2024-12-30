import { Tag, TagToken, TopLevelToken, Context, Emitter, Liquid, TokenKind } from 'liquidjs';

class JavascriptTag extends Tag {
  private javascriptCode: string[];

  constructor(token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid) {
    super(token, remainTokens, liquid);
    this.javascriptCode = [];

    let currentToken: TopLevelToken | undefined;
    while ((currentToken = remainTokens.shift())) {
      if (currentToken.kind === TokenKind.Tag && (currentToken as TagToken).name === 'endjavascript') {
        break;
      }
      if (currentToken.kind === TokenKind.HTML) {
        this.javascriptCode.push((currentToken as any).raw); 
      }
    }
  }

  *render(ctx: Context, emitter: Emitter): Generator<any, void, any> {
    const javascriptContent = this.javascriptCode.join('\n');
    emitter.write(`<script>\n${javascriptContent}\n</script>`);
  }
}

export default JavascriptTag;
