const utils = require("../_utils");

const cheeses = ["SB+", "Gouda", "Brie", "Swiss", "Marble", "Rockforth"];

module.exports = {
  default: {
    location: utils.genVarField("location", "Ronza's Traveling Shoppe")
  },
  series: [
    {
      cheese: utils.genVarField("cheese", cheeses)
    }
  ]
};
