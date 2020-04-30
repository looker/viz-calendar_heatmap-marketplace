import React from "react";
import ReactDOM from "react-dom";
import CalendarHeatmap from './calendar-heatmap.component'
import * as d3 from "d3";
import moment from "moment";

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
      { "month": "month" },
      { "week": "week" },
      { "day": "day" }
    ],
    default: "year",
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
  }
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

    if (queryResponse.fields.measures.length == 0) {
      this.addError({
        title: "No Measures",
        message: "This chart requires measures."
      });
      return;
    }

    if (queryResponse.fields.dimensions.length == 0) {
      this.addError({
        title: "No Dimensions",
        message: "This chart requires dimensions."
      });
      return;
    }
    if (data == 0) {
      this.addError({
        title: "No Results",
        message: ""
      });
      return;
    }

    var firstRow = data;
    const dim1  = queryResponse.fields.dimension_like[0].name;
    const meas1 = queryResponse.fields.measure_like[0].name;

    let reporttime = data.map(d => {return moment(d[dim1].value)} );
    let now    = moment.max(reporttime).add(1, 'days');
    let time_ago = moment.min(reporttime);       

    var orlist = d3.timeDays(time_ago, now);

    let chunks = data.map(d => {
      return {
        dimension: d[dim1], 
        value: d[meas1],
        date: moment(d[dim1].value)._d
      }
    });
    console.log(chunks)

    const dataready = orlist.map(function (dateElement, index) {
          return {
              date: dateElement,
              details: data.filter(details => details[dim1].value == moment(dateElement).format('YYYY-MM-DD')).map(function(filrow,err) { 
                  return {
                     'name': filrow[dim1].value,
                     'date': function () {
                      let projectDate = new Date(dateElement.getTime())
                      projectDate.setHours(Math.floor(Math.random() * 24))
                      projectDate.setMinutes(Math.floor(Math.random() * 60))
                      return projectDate
                    }(), //filrow[dim1].value,
                     'value': parseInt(filrow[meas1].value)
                  }}),
                  init: function () {
                    this.total = this.details.reduce(function (prev, e) {
                      return prev + e.value
                    }, 0)
                    return this
                  } 
          }.init()
        });

     const dataclean =  dataready.filter( (ele, ind) => ind === dataready.findIndex( elem => elem.date === ele.date));
     
     const finaldata = dataclean.map(d => {
      let summary = d.details.reduce((uniques, project) => {
        if (!uniques[project.name]) {
          uniques[project.name] = {
            'value': parseInt(project.value)
          }
        } else {
          uniques[project.name].value += project.value
        }
        return uniques
      }, {})
      let unsorted_summary = Object.keys(summary).map(key => {
        return {
          'name': key,
          'value': parseInt(summary[key].value)
        }
      })
      d.summary = unsorted_summary.sort((a, b) => {
        return b.value - a.value
      })
      return d
    });

    console.log(finaldata);
    if (finaldata.length == 0) {
      this.addError({
        title: "Wrong input pattern or insufficient data.",
        message: "Calendar Heatmap requires one non-null date dimension and one measure."
      });
      return;
    }

    
    
   
    // Finally update the state with our new data
    this.chart = ReactDOM.render(
  
        <CalendarHeatmap
         data            = {finaldata}
         color           = {config.color_picker}
         overview        = {config.overview}
         measure         = {config.measure}
         totmeasure      = {config.tot_measure}
         sizeonday       = {config.sizeshape}
         rows            = {config.rows}
         startdate       = {time_ago}
         enddate         = {now}
        />,
      element
    );

    // We are done rendering! Let Looker know.
    done();
  }
});
