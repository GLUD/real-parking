// format used to parse WFS GetFeature responses
var geojsonFormat = new ol.format.GeoJSON()

var islaSource = new ol.source.Vector({
  loader: function(extent, resolution, projection) {
    var url = '/geoserver/real-parking/ows?service=WFS&' +
      'version=1.0.0&request=GetFeature&typename=real-parking:isla&' +
      'outputFormat=application%2Fjson' +
      '&srsname=EPSG:3857&bbox=' + extent.join(',') + ',EPSG:3857'
      // use jsonp: false to prevent jQuery from adding the "callback"
      // parameter to the URL
    $.ajax({
      url: url,
      // crossDomain: true,
      // xhrFields: {cors: false},
      dataType: 'json',
      jsonp: false
    }).done(function(response) {
      islaSource.addFeatures(geojsonFormat.readFeatures(response))
    })
  },
  strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
    maxZoom: 19
  }))
})

var islaLayer = new ol.layer.Vector({
  source: islaSource,
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(0, 0, 255, 1.0)',
      width: 2
    })
  })
})

var osmLayer = new ol.layer.Tile({
  source: new ol.source.OSM()
})

//document.body.onclick = function (e) {console.log(map.getEventCoordinate(e))}
var map = new ol.Map({
  layers: [osmLayer, islaLayer],
  target: document.getElementById('map'),
  view: new ol.View({
    center: [-8244952.014276695, 515728.84084898204],
    maxZoom: 26,
    zoom: 18
  })
})

var sidebar = $('#sidebar').sidebar()

function changeVisibility(elem) {
  elem.estado = (elem.estado === true) ? false : true
  var estado = elem.estado
  var opt = $(elem).attr('data-layer')
  changeVisibilityLayer(opt, estado)
  var elem = $(elem).children()[0]
  changeVisibilityElement(elem, estado)
}

function changeVisibilityElement(elem, estado) {
  console.log(elem, estado)
  if (estado) {
    $(elem).text('visibility_on')
  } else {
    $(elem).text('visibility_off')
  }
}

function changeVisibilityLayer(opt, estado) {
  console.log(opt, estado)
  switch (opt) {
    case 'sotano1_islas_vector':
      islaLayer.setVisible(estado)
      break;
    default:

  }
}
