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

var style = new ol.style.Style({
  fill: new ol.style.Fill({
    color: 'rgba(255, 255, 255, 0.6)'
  }),
  stroke: new ol.style.Stroke({
    color: '#319FD3',
    width: 1
  }),
  text: new ol.style.Text({
    font: '12px Calibri,sans-serif',
    fill: new ol.style.Fill({
      color: '#000'
    }),
    stroke: new ol.style.Stroke({
      color: '#fff',
      width: 3
    })
  })
});

var islaLayer = new ol.layer.Vector({
  source: islaSource,
  style: function(feature, resolution) {
    style.getText().setText(resolution < 5000 ? feature.get('name') : '');
    return style;
  }
})

var osmLayer = new ol.layer.Tile({
  source: new ol.source.OSM()
})

//document.body.onclick = function (e) {console.log(map.getEventCoordinate(e))}
var map = new ol.Map({
  layers: [osmLayer, islaLayer],
  target: document.getElementById('map'),
  view: new ol.View({
    //map.on('click',function(e){console.log(e)}) //asi lo obtuve
    center: [-8244961.270323087, 515926.5022268131],
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

var highlightStyleCache = {};
var featureOverlay = new ol.layer.Vector({
  source: new ol.source.Vector(),
  map: map,
  style: function(feature, resolution) {
    var text = resolution < 5000 ? feature.get('name') : '';
    if (!highlightStyleCache[text]) {
      highlightStyleCache[text] = new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#f00',
          width: 1
        }),
        fill: new ol.style.Fill({
          color: 'rgba(255,0,0,0.1)'
        }),
        text: new ol.style.Text({
          font: '12px Calibri,sans-serif',
          text: text,
          fill: new ol.style.Fill({
            color: '#000'
          }),
          stroke: new ol.style.Stroke({
            color: '#f00',
            width: 3
          })
        })
      });
    }
    return highlightStyleCache[text];
  }
});

// var highlight;
// var displayFeatureInfo = function(pixel) {
//
//   var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
//     return feature;
//   });
//
//   var info = document.getElementById('info');
//   if (feature) {
//     //console.log(feature)
//     info.innerHTML = feature.getId() + ': ' + feature.get('name');
//   } else {
//     info.innerHTML = '&nbsp;';
//   }
//
//   if (feature !== highlight) {
//     if (highlight) {
//       featureOverlay.getSource().removeFeature(highlight);
//     }
//     if (feature) {
//       featureOverlay.getSource().addFeature(feature);
//     }
//     highlight = feature;
//   }
//
// };
//
// map.on('pointermove', function(evt) {
//   if (evt.dragging) {
//     return;
//   }
//   var pixel = map.getEventPixel(evt.originalEvent);
//   //console.log(pixel)
//   //displayFeatureInfo(pixel);
// });

var highlight;
function displayFeatureById(id){//'isla.1'
  var feature = islaSource.getFeatureById(id)

  var info = document.getElementById('info');
  if (feature) {
    //console.log(feature)
    info.innerHTML = feature.getId() + ': ' + feature.get('name');
  } else {
    info.innerHTML = '&nbsp;';
  }

  if (feature !== highlight) {
    if (highlight) {
      featureOverlay.getSource().removeFeature(highlight);
    }
    if (feature) {
      featureOverlay.getSource().addFeature(feature);
    }
    highlight = feature;
  }
}

let createOverlay = function() {
  return new ol.layer.Vector({
    source: new ol.source.Vector(),
    map: map,
    style: highlightStyle
  });
}

let highlightStyle = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: '#f00',
    width: 1
  }),
  fill: new ol.style.Fill({
    color: 'rgba(255,0,0,0.1)'
  })
})

const socket = io()
const islas = {}
const eventEmitter = new EventEmitter()

socket.on('parking-change', function (data) {
  let isla = data
  isla.id = 'isla.' + isla.id

  console.log(isla)

  if(!islas[isla.id]) {
    islas[isla.id] = {
      overlay: createOverlay(),
      feature: islaSource.getFeatureById(isla.id),
      marked: false
    }

    if(!islas[isla.id].feature)
      islas[isla.id] = undefined
  }

  if(isla.state == 0 && islas[isla.id].marked) {
    islas[isla.id].overlay.getSource().removeFeature(islas[isla.id].feature)
    islas[isla.id].marked = false;

    eventEmitter.emitEvent('cobro', [isla])
  }

  if(isla.state == 1 && !islas[isla.id].marked) {
    islas[isla.id].overlay.getSource().addFeature(islas[isla.id].feature)
    islas[isla.id].marked = true;
  }
})
