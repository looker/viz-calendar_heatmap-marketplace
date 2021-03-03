/*

 MIT License

 Copyright (c) 2020 Looker Data Sciences, Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */

import React, { useState, useRef, useEffect } from 'react'
import { computeTooltipPosition } from './utils'
import { DefaultToolTip } from './DefaultTooltip'
import { VegaChart } from './vega-charts/VegaChart'

export const Tooltip = React.forwardRef(
  ({ datum, visible, x, y, chartType, scale }, ref) => {
  // We can't use styled components here for performance reasons.
  // x & y change way too frequently.
    const styles = {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      borderRadius: '4px',
      color: 'white',
      overflow: 'hidden',
      padding: '12px',
      textOverflow: 'ellipsis',
      visibility: visible ? 'visible' : 'hidden',
      whiteSpace: 'nowrap',
      position: 'fixed',
      top: `${y}px`,
      left: `${x}px`,
    }

    let tooltipDef;
    if (chartType === "default") {
      tooltipDef = <DefaultToolTip datum={datum} />
    } else {
      tooltipDef = 
        <VegaChart 
          datum={datum} 
          chartType={chartType} 
          scale={scale}
        />
    }

    return  (
      <div ref={ref} style={styles}>
        {tooltipDef}
      </div>
    )
  }
)

const defaultTooltipState = {
  chartType: "default",
  datum: undefined,
  visible: false,
  x: 0,
  y: 0,
}

export function useTooltip() {
  const [windowWidth, setWindowWidth] = useState(0)
  const [hovered, setHovered] = useState(defaultTooltipState)
  const tooltipContainer = useRef(null)

  useEffect(() => {
    setWindowWidth(window.innerWidth)
  }, [])

  const handleMouseMove = (event, datum) => {
    console.log(event, datum)
    const x = event.clientX
    const y = event.clientY
      // @ts-ignore
    const tooltipWidth = tooltipContainer.current.clientWidth
    // @ts-ignore
    const position = computeTooltipPosition(x, y, tooltipWidth, windowWidth)

    setHovered({
      chartType: hovered.chartType,
      datum: datum,
      visible: true,
      x: position.x,
      y: position.y,
    })
  }

  const handleMouseOut = () => {
    setHovered({
      ...hovered,
      visible: false,
    })
  }

  return ({
    tooltipContainer,
    initalState: hovered,
    tooltipMove: handleMouseMove,
    tooltipOut: handleMouseOut
  })
}
