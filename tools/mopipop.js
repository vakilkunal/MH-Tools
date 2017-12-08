var _ = require("lodash");
var htpop = require("./htpop");
var Promise = require("bluebird");

var baseVars = {
  Location: { 378: { exclude: false } }
};
var baseOpts = {
  retry: true,
  location: "Moussu Picchu"
};

var cheeses = {
  "SB+": { Cheese: { 3: { exclude: false }, 107: { exclude: false } } },
  Gouda: { Cheese: { 4: { exclude: false } } },
  "Glowing Gruyere": { Cheese: { 101: { exclude: false } } },
  Brie: { Cheese: { 10: { exclude: false }, 106: { exclude: false } } }
};

var total = 0;

function print(req) {
  return req.then(function(data) {
    data.forEach(function(row) {
      total += Math.round(row.attraction * row.sample);
      console.log(
        (row.location || "-") +
          "," +
          (row.phase || "-") +
          "," +
          (row.cheese || "-") +
          "," +
          (row.charm || "-") +
          "," +
          Math.round(row.attraction * 10000) / 100 +
          "%" +
          "," +
          row.mouse +
          "," +
          row.sample
      );
    });
  });
}

console.log("Location,Phase,Cheese,Charm,Attraction Rate,Mouse,Sample Size");

Promise.all(
  _.map(cheeses, function(vars, name) {
    var vars = _.extend({}, baseVars, vars);
    var opts = _.extend({}, baseOpts, { cheese: name });
    return print(
      htpop(vars, opts).then(function(data) {
        console.error(name, ":", (data.length && data[0].sample) || 0);
        return data;
      })
    );
  })
).finally(function() {
  console.error("Total hunts", total);
});
