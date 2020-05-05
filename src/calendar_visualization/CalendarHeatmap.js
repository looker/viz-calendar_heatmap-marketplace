import React, { useEffect } from 'react';
import * as d3 from 'd3';
import SSF from "ssf";
import moment from 'moment';
import styled from "styled-components";

const CalendarChartWrapper = styled.div`
  font-family: "Open Sans", "Noto Sans JP", "Noto Sans", "Noto Sans CJK KR",
    Helvetica, Arial, sans-serif;
  color: #3a4245;
  height: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;

  .viz {
    font: 10px sans-serif;
    shape-rendering: crispEdges;
  }
  
  .day {
    stroke: #ccc;
  }
  
  .month {
    fill: none;
    stroke: #000;
    stroke-width: 2px;
  }
  
  div.tooltip {	
    position: absolute;			
    text-align: center;			
    width: auto;				
    height: auto;					
    padding: 2px;	
    color: #fff;			
    font: 12px sans-serif;		
    background: #444;	
    border: 0px;		
    border-radius: 8px;			
    pointer-events: none;			
}


`;

const CalendarHeatmap = (props) => {
	useEffect(() => {
        d3.select('.vis > *').remove();
		drawCalendar(props)
	}, [props])
	return <CalendarChartWrapper className='viz' />
}

const drawCalendar = (props) => {
    var width = props.width,
    height = props.height,
    cellSize = props.width / 60; // cell size

    var percent = d3.format(".1%"),
        format = d3.timeFormat("%Y-%m-%d"),
        Dayformat = d3.timeFormat("%d");
    
    var tooltip = d3.select(".viz").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

    let max_value = d3.max(props.data, d => d.value.value)
    let min_value = d3.min(props.data, d => d.value.value)

    let max_date = d3.max(props.data, d => d.date)
    let min_date = d3.min(props.data, d => d.date)

    let num_years = d3.range(min_date.getYear()+1900, max_date.getYear()+1900+1).length

    let colors = props.color.length == 1 ? ["#FAFAFA", props.color[0]] : props.color ;

    let color = props.color.length !== 1 ? 
                d3.scaleQuantize()
                .range(colors)
                .domain([min_value, max_value]) :
                d3.scaleLinear()
                .range(colors)
                .domain([min_value, max_value]) ;

    var svg = d3.select(".viz").selectAll("svg")
        .data(d3.range(min_date.getYear()+1900, max_date.getYear()+1900+1))
        .enter().append("svg")
        .attr("width", width)
        .attr("height", height/num_years)
        .attr("class", "year")
        .append("g")
        .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + ",5)");

        // .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

    svg.append("text")
        .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
        .style("text-anchor", "middle")
        .text(function(d) { return d; });

    var rect = svg.selectAll(".day")
        .data(function(d) { return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("rect")
        .attr("class", "day")
        .attr("id", function(d) { return "D" + format(d); })
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("fill", "#FFF")
        .attr("x", function(d) { return d3.timeWeek.count(d3.timeYear(d), d) * cellSize; })
        .attr("y", function(d) { return d.getDay() * cellSize; })

    rect.append("title")
        .text(function(d) { return format(d); });

    svg.selectAll(".month")
        .data(function(d) { return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("path")
        .attr("class", "month")
        .attr("d", monthPath);
    
    props.data.forEach( d => {
      d3.select("#D"+format(d.date))
      .on("mouseover", showTooltip)
      .on("mouseout",  hideTooltip)
      .attr("fill", d.value.value ? color(d.value.value) : "#FFF")
      .select("title")
      .text(format(d.date) + ": " + d.value.value)

    })

    function showTooltip(d){
      let text = d3.select(this).select("title").text()
      let date = text.split(':')[0]
      let measure = text.split(':')[1]
      tooltip.style("opacity", .9)
      tooltip.html(`
        ${props.dim_label}: <b>${date}</b></br>\
        ${props.measure_label}: <b>${measure}</b>
      `)
            .style("left", (d3.event.pageX) + "px")		
            .style("top",  (d3.event.pageY - 28) + "px")
            .style("cursor", "pointer")
    }


    function hideTooltip() {
      tooltip.style("opacity", 0);
    }

  

    function monthPath(t0) {
      var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
          d0 = t0.getDay(), w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
          d1 = t1.getDay(), w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
      return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
          + "H" + w0 * cellSize + "V" + 7 * cellSize
          + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
          + "H" + (w1 + 1) * cellSize + "V" + 0
          + "H" + (w0 + 1) * cellSize + "Z";
    }


}

export default CalendarHeatmap