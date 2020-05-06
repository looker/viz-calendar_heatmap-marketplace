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
    font-family: sans-serif;
    shape-rendering: crispEdges;
  }
  
  .day {
    // stroke: #ccc;
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
        d3.selectAll('.year').remove();
        d3.selectAll('.monthLabels').remove();
        d3.selectAll('.tooltip').remove();
		drawCalendar(props)
	}, [props])
	return <CalendarChartWrapper className='vis' />
}

const drawCalendar = (props) => {
    var width = props.width,
    height = props.height,
    cellSize = props.width / 60;

    var percent = d3.format(".1%"),
        format = d3.timeFormat("%Y-%m-%d"),
        Dayformat = d3.timeFormat("%d");
    
    var tooltip = d3.select(".vis").append("div")	
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

    function nthWeekdayOfMonth(weekday, n, date) {
        var count = 0,
            idate = new Date(date.getFullYear(), date.getMonth(), 1);
        while (true) {
            if (idate.getDay() === weekday) {
            if (++count == n) {
                break;
            }
            }
            idate.setDate(idate.getDate() + 1);
        }
        return idate;
    }
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]
    var dateParts = ["-01-01", "-02-01", "-03-01", "-04-01", "-05-01", "-06-01", "-07-01", "-08-01", "-09-01", "-10-01", "-11-01", "-12-01"]

    props.label_month ? d3.select(".vis")
        .append("svg")
        .attr("class", "monthLabels")
        .attr("width", "100%")
        .attr("height", "20")
        .selectAll("text")
        .data(d3.range(0, 12))
        .enter().append("text")
        .attr("class", "monthLabel")
        .attr("font-size", "1.5vw")
        .text(function(d) { return monthNames[d] })
        .attr("x", function(d) {
            var x_date = new Date((min_date.getYear()+1900 + dateParts[d])+1)
            return d3.timeWeek.count(d3.timeYear(nthWeekdayOfMonth(0, 1, x_date)), nthWeekdayOfMonth(0, 1, x_date)) * cellSize + (cellSize * 3.5);
        })
        .attr("y", 16)
        .on("mouseover", function(d) {
            console.log(d+1)
            svg.selectAll(".day").filter(function(datum) {
                return datum.getMonth() !== d;
            })
            .style("opacity", 0.2);
        })
        .on("mouseleave", function(d) {
            svg.selectAll(".day")
            .style("opacity", 1);
        }) : null;

    var svg = d3.select(".vis").selectAll(".year")
        .data(d3.range(min_date.getYear()+1900, max_date.getYear()+1900+1))
        .enter().append("svg")
        .attr("width", width)
        .attr("height", cellSize * 8)
        .attr("class", "year")
        .append("g")
        .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + ",5)");

    props.label_year ? svg.append("text")
        .attr("font-size", "2vw")
        .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
        .style("text-anchor", "middle")
        .text(function(d) { return d; })
        .on("mouseover", function(d) {
            svg.selectAll(".day").filter(function(datum) {
                return (datum.getYear()+1900) !== d;
            })
            .style("opacity", 0.2);
        })
        .on("mouseleave", function(d) {
            svg.selectAll(".day")
            .style("opacity", 1);
        }) : null ;

    var rect = svg.selectAll(".day")
        .data(function(d) { return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("rect")
        .attr("class", "day")
        .attr("id", function(d) { return "D" + format(d); })
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("rx", props.rounded ? 100 : 0)
        .attr("ry", props.rounded ? 100 : 0)
        .style("pointer-events","visible")
        .style("cursor", "pointer")
        .attr("fill", "#FFF")
        .attr("stroke",  "#cecece")
        .attr("x", function(d) { return d3.timeWeek.count(d3.timeYear(d), d) * cellSize; })
        .attr("y", function(d) { return d.getDay() * cellSize; })
        .on("mouseover", showTooltip)
        .on("mouseleave", hideTooltip)
        .on("click", function(d) {
            var target = props.data.filter(function(v) {
                return format(v.date) === format(d);
            })
            LookerCharts.Utils.openDrillMenu({
                links: target[0].value.links,
                event: event
            });
        });
    
    rect.append("span")
        .style("display", "none")
        .append("title")
        .text(function(d) { return format(d);})

    props.outline ? svg.selectAll(".month")
        .data(function(d) { return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("path")
        .attr("class", "month")
        .attr("d", monthPath) : null;
    
    props.data.forEach( d => {
        var valueFormatted = props.formatting !== "" ? SSF.format(props.formatting, d.value.value) : LookerCharts.Utils.textForCell(d.value)
        d3.select("#D"+format(d.date))
        .attr("fill", d.value.value ? color(d.value.value) : "#FFF")
        .select("title")
        .text(format(d.date) + ": " + valueFormatted)
        .on("click", LookerCharts.Utils.openDrillMenu(d.value.links));
    })

    function showTooltip(d) {
        let text = d3.select(this).select("title").text()
        let date = text.split(':')[0]
        let measure = text.split(':')[1] ? text.split(':')[1] : ''
        tooltip.style("opacity", .9)
        tooltip.html(`
                ${props.dim_label}: <b>${date}</b></br>\
                ${ measure === '' ? '' : props.measure_label +':'} <b>${measure}</b>
            `)
                .style("left", (d3.event.pageX) + "px")
                .style("top",  (d3.event.pageY - 28) + "px")
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