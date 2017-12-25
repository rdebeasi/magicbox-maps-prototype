/**
 * countryStyle - Specifies the style for the geojson
 * @param  {type} props description
 * @return {object} style
 */
export function adminStyle(props) {
  return function(geoJsonFeature) {
    let admin_id = geoJsonFeature.properties.admin_id
    let admin_index = props.activeCountry.admin_index
    let active_country = props.activeCountry
    let selected_admins = active_country.selected_admins
    let scores = active_country.scores || active_country.diagonal
    const displayCountry = {
      fill: true,
      fillColor: 'red',
      fillOpacity: scores ?
        (scores[admin_index[admin_id]]
        || 0)
        : Math.random(),
      stroke: false
    }

    if (selected_admins) {
      if (selected_admins) {
        if (selected_admins[admin_id]) {
          Object.assign(displayCountry, {
            fillColor: 'blue',
            // fillOpacity: (Object.keys(selected_admins).length > 1) ?
            //   scores[admin_index[admin_id]] : 1
            fillOpacity: 1
          })
        }
      }
    }
    return displayCountry
  }
}
