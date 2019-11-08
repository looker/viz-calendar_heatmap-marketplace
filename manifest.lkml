project_name: "viz-calendar_heatmap-marketplace"

constant: VIS_LABEL {
  value: "Calendar Heatmap"
  export: override_optional
}

constant: VIS_ID {
  value: "calendar_heatmap-marketplace"
  export:  override_optional
}

visualization: {
  id: "@{VIS_ID}"
  url: "https://looker-custom-viz-a.lookercdn.com/master/calendar_chart.js"
  label: "@{VIS_LABEL}"
}
