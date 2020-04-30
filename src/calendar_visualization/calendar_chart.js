import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from 'prop-types'
import * as d3 from "d3";
import moment from "moment";
import CalendarHeatmap from './calendar-heatmap.component'
import ReactDOM from 'react-dom'


const CalendarHMWrapper = styled.div`
  text-align: center;
  font-family: "Open Sans", "Noto Sans JP", "Noto Sans", "Noto Sans CJK KR",
    Helvetica, Arial, sans-serif;
  color: #3a4245;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
;
`

class CalendarHM extends Component {
    constructor(props) {
      super(props)
      
      
      this.calendarSetup  = this.calendarSetup.bind(this);
      //this.calendarUpdateoverview = this.calendarUpdateoverview.bind(this);
      //this.calendarUpdatecolor = this.calendarUpdatecolor.bind(this);
        
     
    }

    calendarSetup() {
      
      //let CONFIG = this.props.config
      //console.log("Parameter: ");
     // console.log(this.props.data);
      //let DATA = this.props.data_d
    
   



 


      let now = moment().endOf('day').toDate()//CONFIG.enddate;//moment().endOf('day').toDate()
      let time_ago = moment().startOf('day').subtract(4, 'year').toDate()//CONFIG.startdate;//moment().startOf('day').subtract(4, 'year').toDate()
      let data = d3.timeDays(time_ago, now).map(function (dateElement, index) {
        return {
          date: dateElement,
          details: Array.apply(null, new Array(Math.floor(Math.random() * 15))).map(function(e, i, arr) {
            return {
              'name': function (){
                  let nameEv = ''
                  let opt = Math.floor(Math.random() * 5)
                  if (opt == 0)
                  {
                    nameEv = 'Purchase'
                  }
                  else if (opt == 1)
                  {
                    nameEv = 'Category'
    
                  }
                  else if (opt == 2)
                  {
                    nameEv = 'History'
    
                  }
                  else if (opt == 3)
                  {
                    nameEv = 'Cart'
    
                  }
                  else if (opt == 4)
                  {
                    nameEv = 'Product'
                  }
                  else if (opt == 5)
                  {
                    nameEv = 'Home'
                  }
                  return nameEv
              }(), 
              
              //'Project ' + Math.ceil(Math.random() * 10),
              'date': function () {
                let projectDate = new Date(dateElement.getTime())
                projectDate.setHours(Math.floor(Math.random() * 24))
                projectDate.setMinutes(Math.floor(Math.random() * 60))
                return projectDate
              }(),
              'value': Math.floor(Math.random() * 3)//3600 * ((arr.length - i) / 5) + Math.floor(Math.random() * 3600) * Math.round(Math.random() * (index / 365))
            }
          }),
          init: function () {
            this.total = this.details.reduce(function (prev, e) {
              return prev + e.value
            }, 0)
            return this
          }
        }.init()
      });
    
      // console.log("Mounted: ");
      //
      this.setState({data:data});
     // console.log(this.state.data);
      
    };

    print(val) {
      // console.log(val)
    }
    
    // componentWillReceiveProps()
    // {}

    componentWillMount()
    {
        // console.log("will");
        this.calendarSetup();
    }

    // componentDidMount(){
        
    //   //this.render();
    //   console.log("did");
    // }         
        //this.setState({color:this.props.config.target_color});

    //     this.svg = d3.select('#calendar-heatmap')
    //   .append('svg')
    //   .attr('class', 'svg')

    // // Create other svg elements
    // this.items = this.svg.append('g')
    // this.labels = this.svg.append('g')
    // this.buttons = this.svg.append('g')

    getCalendar(){
      
        this.calendarSetUp();
        this.render();
    }

    render() {   
      // console.log(this.state.data);
      return (
        
        <CalendarHeatmap
           data            = {this.state.data} 
          // color           = {this.props.config.target_color}
          // overview        = {this.props.config.target_overview}
          // measure         = {this.props.config.target_measure}
          // totmeasure      = {this.props.config.target_totmeasure}
          // sizeonday       = {this.props.config.target_sizeonday}
          // title           = {this.props.config.title}
          // font_size_title = {this.props.config.font_size_title}
          // font_size_date  = {this.props.config.font_size_dates}
          // startdate       = {this.props.config.startdate}
          // enddate         = {this.props.config.enddate}
           color           = "red"//{baseOptions.color_range}
           overview        = "year"//{baseOptions.overview}
           measure         = "Test"//{this.props.config.target_measure}
           totmeasure      = "Test"//{this.props.config.target_totmeasure}
           sizeonday       = '20' //{this.props.config.target_sizeonday}
           title           = "Test"//{this.props.config.title}
           font_size_title = "48"//{this.props.config.font_size_title}
           font_size_date  = "20"//{this.props.config.font_size_dates}
           // startdate       = "01012019"//{this.props.config.startdate}
           // enddate         = "25092019"//{this.props.config.enddate}
           handler={this.print.bind(this)}
          >
        </CalendarHeatmap>
      )
    }

    
  }
  
  CalendarHM.propTypes = {
    config: PropTypes.object,
    data: PropTypes.array,
  };

  export default CalendarHM;