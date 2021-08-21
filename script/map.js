//Variables
var vectorSource; //line layer
var view; //map view
var map;

var iconFeature; //line point
var iconSource;
var iconStyle;
var iconLayer;

var geolocation;
var points = [];
var pos;
var lastPos;
var interval; //time interval to update position

var geographic = new ol.proj.Projection("EPSG:4326");
var mercator = new ol.proj.Projection("EPSG:900913");
var speed = 0.0
var distance = 0.0;

//Empty vector where the line is later added 
vectorSource = new ol.source.Vector({});

//View
view = new ol.View({
  center: [1818831.7942307333, 6140484.332635549],
  zoom: 3
})

//Map
map = new ol.Map({
  interactions: ol.interaction.defaults({ mouseWheelZoom: false }),
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
      visible: false
    }),
    new ol.layer.Vector({
      source: vectorSource
    })
  ],
  target: 'map',
  view: view,
  controls: ol.control.defaults({
    attribution: false,
    zoom: false,
  }),
});

//Add an empty iconFeature to the source of the layer
iconFeature = new ol.Feature();

iconSource = new ol.source.Vector({
  features: [iconFeature]
});

iconStyle = new ol.style.Style({
  image: new ol.style.Icon({
    anchor: [0.5, 100],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    scale: 0.03,
    opacity: 1.0,
    src: 'img/point.png'
  })
});

iconLayer = new ol.layer.Vector({
  source: iconSource,
  style: iconStyle
});

map.addLayer(iconLayer);

//Geolocation
geolocation = new ol.Geolocation({
  projection: map.getView().getProjection(),
  tracking: false, //used when no checkbox is used
  trackingOptions: {
    enableHighAccuracy: true,
    maximumAge: 2000
  }
});

//Updates track line
function updateTrackLine(pos) {

  // //Update line points
  // if (lastPos == undefined) {
  //   lastPos = pos;
  // }

  //Line
  let lineString = new ol.geom.LineString([lastPos, pos]);

  // //Update lastpos for next round
  // lastPos = pos;

  let lineFeature = new ol.Feature({
    name: 'Line',
    geometry: lineString,
  });

  let lineStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#f00',
      width: 4,
      opacity: 1
    })
  });

  //Style has to be added later and cannot be created in the Style in one go
  lineFeature.setStyle(lineStyle);
  vectorSource.addFeature(lineFeature);

  //Fit trackline into map view

  let featuresOfInterest = vectorSource.getFeatures(); //Features of Line Strings - array
  let featExtent = featuresOfInterest[0].getGeometry().getExtent(); //preparing feature variable 
  for (let i = 0; i < featuresOfInterest.length; i++) {
    ol.extent.extend(featExtent, featuresOfInterest[i].getGeometry().getExtent());  //saving all features into one variable
  }
  view.fit(featExtent, { padding: [5, 5, 5, 5] });
}

function getElement(selector) {
  return document.querySelector(selector);
}

function updateLocation() {
  //Tracking has to be true
  pos = geolocation.getPosition();

  console.log(pos);

  //Update line points
  if (lastPos == undefined) {
    lastPos = pos;
  }

  points.push(pos);

  //Update icon coordinates
  iconFeature.setGeometry(new ol.geom.Point(pos));

  // //Update speed display
  // getElement('.speed').innerText = `speed: ${geolocation.getSpeed()} [m/s]`;

  //Create new track lines
  updateTrackLine(pos);

  //Update lastpos for next round
  lastPos = pos;

  //Update speed 
  speed = geolocation.getSpeed();

  //Update distance
  let lineString = new ol.geom.LineString(points);
  distance = formatLength(lineString);
  // distance += distanceBetweenPoints(pos, lastPos);
  console.log('distance: ' + distance);
  console.log('pos: ' + pos + ', lastPos: ' + lastPos);

  getElement('.trackOutput').innerHTML = `<p>speed: ${speed} m/s | distance: ${distance}</p>`;
}

function formatLength(line) {
  const length = line.getLength();
  let output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
  } else {
    output = Math.round(length * 100) / 100 + ' ' + 'm';
  }
  return output;
};

function distanceBetweenPoints(latlng1, latlng2) {
  // var point1 = new ol.geom.Point(latlng1.lon, latlng1.lat).transform(geographic, mercator);
  // var point2 = new ol.geom.Point(latlng2.lon, latlng2.lat).transform(geographic, mercator);   
  // console.log(latlng1);
  var point1 = new ol.geom.Point(latlng1);
  var point2 = new ol.geom.Point(latlng2);      
  let dist = ol.sphere.getDistance(point1, point2);
  return dist;
}

//Start interval
function startInterval(milliSec) {
  interval = setInterval(updateLocation, milliSec);
}

function stopInterval() {
  clearInterval(interval);
  interval = null;
}

//Toggle start/ stop tracking, time interval pos update
function toggleStartStop() {
  let isTracked = geolocation.getTracking();
  let startStopBtn = document.querySelector('.startStopBtn');

  if (isTracked) {
    //Stop tracking
    geolocation.setTracking(false);
    startStopBtn.innerHTML = 'START';
    //Stop updating pos
    stopInterval();
  } else {
    //Start tracking
    geolocation.setTracking(true);
    //Update location for the first time
    geolocation.once('change', updateLocation);
    //Start updating pos all 5 sec (first update after 5 sec)
    startInterval(5000);
    startStopBtn.innerHTML = 'STOP';
  }
}

//Eventlistener start button
document.querySelector('.startStopBtn').addEventListener('click', function () {
  toggleStartStop();
});