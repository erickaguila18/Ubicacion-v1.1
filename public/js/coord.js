

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position) {
  document.getElementById("latitude").value=position.coords.latitude;
  document.getElementById("longitude").value=position.coords.longitude;
}
