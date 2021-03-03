import { sort } from 'd3';
import React from 'react';
import { VegaLite } from 'react-vega';
import embed from 'vega-embed'
import { NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL } from 'vega-lite/build/src/type';
import { DefaultToolTip } from '../DefaultTooltip';


function getTypeForScale(scale) {
  const SCALES = {
    time:     TEMPORAL,
    number:   QUANTITATIVE,
    ordinal:  ORDINAL,
    nominal:  NOMINAL,
  }
  return SCALES[scale||'number']
}

export function VegaChart({ datum, chartType, scale }) {
  if (datum[0]) {
    const { dimension, measure, data } = datum[0].turtle
    const spec = {
      mark: chartType,
      data: { 
        name: 'turtles', 
        values: data
      },
      encoding: {
        x: { 
          field: dimension.name.replace('.', '_'), 
          type: getTypeForScale(scale),
          axis: { title: dimension.label, grid: false},
          sort: "-y"
        },
        y: { 
          field: measure.name, 
          type: QUANTITATIVE,
          axis: { title: measure.label, grid: false },
        }
      },
    }
  
    const dataWrapper = { turtles: data }
    embed('#tooltip', spec, {theme: 'dark', actions: false})
  } 
  (<DefaultToolTip datum={datum} />)
}