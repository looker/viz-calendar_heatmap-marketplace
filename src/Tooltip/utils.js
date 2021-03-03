/**
 * Computes the tooltip position, given the mouse position, tooltip width and
 * window width. It will offset the tooltip down and to the right where it can.
 * If it's going to go past the right edge of the window, it places the tooltip
 * down and to the left.
 *
 * @param rawX The x position of the mouse cursor.
 * @param rawY The y position of the mouse cursor.
 * @param tooltipWidth The width of the tooltip.
 * @param windowWidth The window width.
 */
export const computeTooltipPosition = (
    rawX,
    rawY,
    tooltipWidth,
    windowWidth
  ) => {
    const TOOLTIP_OFFSET = 8
  
    // If mouse on left side of screen, draw tooltip right and vice versa
    const tooltipX =
      rawX > (windowWidth/2)
        ? rawX - TOOLTIP_OFFSET - tooltipWidth
        : rawX + TOOLTIP_OFFSET
  
    // Much less likely to run off the bottom of the page, so ignore for now.
    const tooltipY = rawY + TOOLTIP_OFFSET
  
    return {
      x: tooltipX,
      y: tooltipY,
    }
  }
  