// src/index.js

const { Liquid } = require('liquidjs');
const moneyFilter = require('./filters/moneyFilter');
const uppercaseTag = require('./tags/uppercaseTag');

class RenderingEngine {
  constructor() {
    this.engine = new Liquid();

    // Register custom filters
    this.engine.registerFilter('money', moneyFilter);

    // Register custom tags
    this.engine.registerTag('uppercase', uppercaseTag);

    // Add more customizations as needed
  }

  async render(template, data) {
    try {
      return await this.engine.parseAndRender(template, data);
    } catch (error) {
      throw new Error(`Template rendering error: ${error.message}`);
    }
  }

  parse(template) {
    try {
      return this.engine.parse(template);
    } catch (error) {
      throw new Error(`Template parsing error: ${error.message}`);
    }
  }
}

module.exports = RenderingEngine;
