'use strict';

module.exports = function (ctx) {
  return {
    parser: ctx.sugar ? 'sugarss' : false,
    map: ctx.env ==='production' ? false : 'inline',
    plugins: {
      'autoprefixer': {},
      'precss': {},
      'postcss-nested': {}
    }
  }
}