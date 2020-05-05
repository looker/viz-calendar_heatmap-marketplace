import React from "react";
import ReactDOM from "react-dom";
import CalendarHeatmap from './CalendarHeatmap'
import * as d3 from "d3";
import moment from "moment";
import { timeYears } from "d3";

const colorByOps = {
  SEGMENT: "segment",
  RANGE: "range"
};
const baseOptions = {
  overview: {
    type: "string",
    label: "View Level",
    display: "select",
    values: [
      { "year": "year" },
      { "year2": "year2" },
      { "month": "month" },
      { "week": "week" },
      { "day": "day" }
    ],
    default: "year2",
    section: "Style",
    order: 100
  },
  color_picker: {
    type: "array",
    label: "Calendar Color",
    display: "colors",
    default: ["#7FCDAE", "#ffed6f", "#EE7772"],
    section: "Style",
    order: 4
  },
  rows: {
    type: "number",
    label: "How many rows?",
    default: 1,
    section: "Style"
  },
  measure: {
    type: "string",
    label: "Tooltip Label Override",
    default: "Counts",
    section: "Values",
    order: 2
  },
  tot_measure: {
    type: "string",
    label: "Totals Tooltip Label Override",
    default: "Total Counts",
    section: "Values",
    order: 3
  },

  // HIDDEN OPTIONS
  height: {
    type: "number",
    hidden: true
  },
  width: {
    type: "number",
    hidden: true
  },
};

looker.plugins.visualizations.add({
  id: "heatmap_chart",
  label: "Calendar Heatmap",
  options: baseOptions,
  create: function(element, config) {
    this.chart = ReactDOM.render(<div></div>, element);
  },
  updateAsync: function(data, element, config, queryResponse, details, done) {
    this.clearErrors();

    if (queryResponse.fields.measure_like.length == 0) {
      this.addError({
        title: "No Measures",
        message: "This chart requires measures."
      });
      return;
    }
    if (queryResponse.fields.dimension_like.length == 0) {
      this.addError({
        title: "No Dimensions",
        message: "This chart requires dimensions."
      });
      return;
    }
    if (data.length == 0) {
      this.addError({
        title: "No Results",
        message: ""
      });
      return;
    }

    const dim1  = queryResponse.fields.dimension_like[0].name;
    const dim1_label = queryResponse.fields.dimension_like[0].label_short;

    const meas1 = queryResponse.fields.measure_like[0].name;
    const meas1_label = queryResponse.fields.measure_like[0].label_short;

    element.clientWidth != config.width ? this.trigger("updateConfig", [{width: element.clientWidth}]) : null ; 
    element.clientHeight != config.height ? this.trigger("updateConfig", [{height: element.clientHeight}]) : null ; 

    let chunks = data.map(d => {
      return {
        dimension: d[dim1], 
        value: d[meas1],
        date: moment(d[dim1].value)._d
      }
    });
    
    if (chunks.length == 0) {
      this.addError({
        title: "Wrong input pattern or insufficient data.",
        message: "Calendar Heatmap requires one non-null date dimension and one measure."
      });
      return;
    }

    this.chart = ReactDOM.render(
      <CalendarHeatmap
         data = {chunks}
         width = {config.width}
         height = {config.height}
         color = {config.color_picker}
         overview = {config.overview}
         measure = {config.measure}
         totmeasure = {config.tot_measure}
         sizeonday = {config.sizeshape}
         rows = {config.rows}
         measure_label = {meas1_label}
         dim_label = {dim1_label}
        />,
      element
    );
    done();
  }
});
