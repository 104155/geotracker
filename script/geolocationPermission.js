var isGeoPermitted;
var currentPos;

//this will trigger user permission of geolocation on pageload
function triggerLocationPermission() {
    if (navigator.geolocation) {
      currentPos = navigator.geolocation.getCurrentPosition(success, error);
      isGeoPermitted = true;
    } else {
      isGeoPermitted = false;
    }
  }

  function success(pos) {
    var crd = pos.coords;

    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  function documentReady() {
    triggerLocationPermission();
  }

  documentReady();


////Experimental Permission API Chrome/ Firefox
// function handlePermission() {
//     navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
//         if (result.state == 'granted') {
//             report(result.state);
//             // geoBtn.style.display = 'none';
//         } else if (result.state == 'prompt') {
//             report(result.state);
//             // geoBtn.style.display = 'none';
//             // navigator.geolocation.getCurrentPosition(revealPosition, positionDenied, geoSettings);
//         } else if (result.state == 'denied') {
//             report(result.state);
//             // geoBtn.style.display = 'inline';
//         }
//         result.onchange = function () {
//             report(result.state);
//         }
//     });
// }

// function report(state) {
//     console.log('Permission ' + state);
// }

// handlePermission();