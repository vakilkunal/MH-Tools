#!/usr/bin/env node

var jt = require('jacksmhtools-client');
var utils = require('./_utils');

utils
  .process({
    default: {},
    series: [
      {
        location: utils.genVarField('location', 'Bristle Woods Rift'),
        phase: utils.genVarField('stage', [
          'Acolyte',
          'Ancient Lab',
          'Entrance',
          'Frozen Alcove',
          'Furnace Room',
          'Gearworks',
          'Guard Barracks',
          'Hidden Treasury',
          'Ingress',
          'Lucky Tower',
          'Pursuer Mousoleum',
          'Runic Laboratory',
          'Security',
          'Timewarp'
        ]),
        cheese: utils.genVarField('cheese', [
          'Runic String',
          'Ancient String',
          'Magical String',
          'Brie String',
          'Swiss String'
        ]),
        charm: [
          { vars: { charm: { 'Rift Antiskele': false } } },
          {
            vars: { charm: { 'Rift Antiskele': true } },
            fields: { charm: 'Rift Antiskele' }
          }
        ]
      }
    ],
    process: function(item) {
      console.error('requesting', JSON.stringify(item.vars));
      return jt
        .getSAEncounterRateData(item.vars, item.opts)
        .filter(function(item) {
          return item.sample > 100;
        })
        .map(utils.preparePopulation.bind(utils, item.fields));
    }
  })
  .then(utils.toCsv.bind(utils, utils.POP_FIELDS))
  .then(console.log.bind(console));
