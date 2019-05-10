const utils = require("../_utils");

module.exports = {
  default: {
    location: utils.genVarField("location", "Queso Geyser"),
    cheese: utils.genVarField("cheese", [
      "Bland Queso",
      "Mild Queso",
      "Medium Queso",
      "Hot Queso",
      "Flamin' Queso",
      "Wildfire Queso"
    ])
  },
  series: [
    {
      config: [
        {
          vars: { stage: { "Cork Collecting": true } },
          fields: { stage: "Cork Collecting" }
        }
      ]
    },
    {
      config: [
        {
          vars: { stage: { "Pressure Building": true } },
          fields: { stage: "Pressure Building" },
          opts: {
            exclude: [
              "Mild Spicekin",
              "Sizzle Pup",
              "Smoldersnap",
              "Bearded Elder",
              "Ignatia",
              "Cinderstorm",
              "Bruticus, the Blazing",
              "Stormsurge, the Vile Tempest",
              "Kalor'ignis of the Geyser"
            ]
          }
        }
      ]
    },
    {
      phases: utils.genVarField("stage", [
        "Tiny Eruption",
        "Small Eruption",
        "Medium Eruption",
        "Large Eruption",
        "Epic Eruption"
      ]),
      config: [
        {
          opts: {
            exclude: [
              "Fuzzy Drake",
              "Cork Defender",
              "Burly Bruiser",
              "Corky, the Collector",
              "Horned Cork Hoarder",
              "Rambunctious Rain Rumbler",
              "Corkataur"
            ]
          }
        }
      ]
    }
  ]
};
