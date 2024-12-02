import { Liquid } from 'liquidjs';
import moneyFilter from './filters/moneyFilter';
import upperCaseTag from './tags/upperCaseTag';
import PaginateTag from './tags/paginateTag';

class RenderingEngine {
  private engine: Liquid;

  constructor() {
    this.engine = new Liquid();
    this.engine.registerFilter('money', moneyFilter);
    this.engine.registerTag('uppercase', upperCaseTag);
    this.engine.registerTag('paginate', PaginateTag);
  }

  async render(template: string, data: object): Promise<string> {
    try {
      return await this.engine.parseAndRender(template, data);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Template rendering error: ${error.message}`);
      } else {
        throw new Error(`Template rendering error: ${String(error)}`);
      }
    }
  }

  parse(template: string): void {
    try {
      this.engine.parse(template);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Template parsing error: ${error.message}`);
      } else {
        throw new Error(`Template parsing error: ${String(error)}`);
      }
    }
  }
}

export default RenderingEngine;
