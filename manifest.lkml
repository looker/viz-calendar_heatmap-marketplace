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
  url: "https://raw.githubusercontent.com/looker/viz-calendar_heatmap-marketplace/master/calendar_chart.js"
  label: "@{VIS_LABEL}"
}
