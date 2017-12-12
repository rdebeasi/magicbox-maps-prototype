import React, {Component} from 'react'
import {
  connect
} from 'react-redux';
import {
  bindActionCreators
} from 'redux'
import allGeojson  from '../data/allCountriesGEOJSON.js'
import InitialLoad from '../actions/initialLoad';

import {
  GeoJSON,
  Map,
  ZoomControl,
  TileLayer,
} from 'react-leaflet'
// import L from 'leaflet';
import {
  alpha3ToAlpha2
} from 'i18n-iso-countries';
var _ = require('lodash');

class MyMap extends Component {
  state = {
    lat: 0,
    lng: 0,
    zoom: 2,
  }
  componentWillMount() {
    this.props.initialLoad();
  }
  countryStyle = (geoJsonFeature) => {
    //var layer = e.target;
    const displayCountry = {
      fill: true,
      fillColor: '#0099FF',
      fillOpacity: .5,
      stroke: false,
    }
    const nullDisplay = {
      fill: false,
      fillColor: '#0099FF',
      fillOpacity: 0,
      stroke: false,
    }
    var alpha2 =alpha3ToAlpha2(geoJsonFeature.id);
    if (this.props.initialCountries.indexOf(alpha2) > -1) {
      return displayCountry;
    }else{
      return nullDisplay;

    }
  }
  geoFilter = (feature) => {
    var alpha2 = alpha3ToAlpha2(feature.id);
    if (this.props.initialCountries.indexOf(alpha2) > -1) {
      return true
    }
    return false
  }
  onEachFeature = (feature, layer) => {
    // if (this.props.countrySelected.admin1 === feature.id) {
    //   layer.setStyle({
    //     fillOpacity: 0
    //   });
    // }
    layer.on({
      'mouseover': (e) => {
        layer.setStyle({
          fillOpacity: 0.7
        });

      },
      'mouseout': (e) => {
        layer.setStyle({
          fillOpacity: 0.5
        })


      },
      'click': (e) => {
        console.log(e);
        if (this.props.countrySelected.admin1 !== feature.id && this.props.countrySelected.country === 'BR') {
          // var admin1 = e.target.feature.id;
          // //console.log(e.target.feature.properties.UF);
          // var admin1L = e.target.feature.properties.UF
          // console.log(admin1);
          // var alpha2 = 'BR'
          // console.log("Calling: " + alpha2);
          // this.props.loadSpinner(true);
          // this.centerCountry(e.latlng, 6);
          // this.props.clickedCountry(alpha2, this.props.sliderData.value, admin1, admin1L);
          // toLoad = true;
        }



        //console.log(e);
      }
    });
  }


  render() {
    const position = [this.state.lat, this.state.lng]
    return (
      <Map ref='map' center={position} zoom={this.state.zoom} zoomControl={false}>
        <ZoomControl position='bottomleft' />
        <TileLayer
          url='https://api.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYXlhbmV6IiwiYSI6ImNqNHloOXAweTFveWwzM3A4M3FkOWUzM2UifQ.GfClkT4QxlFDC_xiI37x3Q'
          attribution='&copy; <a href=http://osm.org/copyright">OpenStreetMap</a> contributors '
        />
        <GeoJSON
          key={_.uniqueId()}
          data={allGeojson}
          style={this.countryStyle.bind(this)}
          onEachFeature={this.onEachFeature.bind(this)}
          filter={this.geoFilter.bind(this)}
        ></GeoJSON>
      </Map>

    )
  }
}
function mapStateToProps(state) {
  return {
     initialCountries: state.initialCountries.initialCountries,
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    initialLoad: InitialLoad,
  }, dispatch)
}

// export default connect(mapStateToProps, matchDispatchToProps)(MyMap);
export default connect(mapStateToProps, matchDispatchToProps)(MyMap);
