const show = document.getElementById("test_show");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    show.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  show.innerHTML = "Latitude: " + position.coords.latitude +
  "<br>Longitude: " + position.coords.longitude;
}