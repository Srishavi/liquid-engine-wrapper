import { Liquid } from 'liquidjs';
import moneyFilter from './filters/moneyFilter';
import upperCaseTag from './tags/upperCaseTag';

class RenderingEngine {
  private engine: Liquid;

  constructor() {
    this.engine = new Liquid();
    this.engine.registerFilter('money', moneyFilter);
    this.engine.registerTag('uppercase', upperCaseTag);
  }

  async render(template: string, data: object): Promise<string> {
    try {
      return await this.engine.parseAndRender(template, data);
    } catch (error) {
      throw new Error(`Template rendering error: ${(error as Error).message}`);
    }
  }

  parse(template: string): void {
    try {
      this.engine.parse(template);
    } catch (error) {
      throw new Error(`Template parsing error: ${(error as Error).message}`);
    }
  }
}

export default RenderingEngine;
