const show = document.getElementById("test_show");

navigator.geolocation.getCurrentPosition(position => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  // Fetch the UV index using the user's latitude and longitude
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=apparent_temperature_max,apparent_temperature_min,wind_speed_10m_max,uv_index_max,precipitation_sum,precipitation_probability_max,cloud_cover_mean`) 
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Convert response to JSON
    })
    .then(data => {
      console.log(data); // Process the JSON data
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});

// Function to display the UV index
function showUV(uvIndex) {
  // Display the received UV index on the page
  show.innerHTML = `The UV Index is: ${uvIndex}`;
}