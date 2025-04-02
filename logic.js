const show = document.getElementById("test_show");

navigator.geolocation.getCurrentPosition(position => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  // Function that handles the weather-based decision logic
function makeWeatherChoices(maxTemperature, minTemperature, maxUVIndex, precipitationChance, windspeed, percipitationsum, cloudcover) {
  let message = `Max Temp: ${maxTemperature}°C, Min Temp: ${minTemperature}°C, Max UV Index: ${maxUVIndex}, Precipitation Chance: ${precipitationChance}%, Percipitation: ${percipitationsum}mm, Wind Speed: ${windspeed}km/h, Cloud Cover: ${cloudcover}%`;

  // Make decisions based on weather conditions
  if (maxTemperature > 30) {
    message += `<br>It's really hot outside. Stay hydrated!`;
  } else if (maxTemperature < 10) {
    message += `<br>It's quite cold, consider wearing a jacket!`;
  }

  // Display the message on the page
  show.innerHTML = message;
}

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
      
      // Extract weather details from the response
      const maxTemperature = data.daily.apparent_temperature_max[0];
      const minTemperature = data.daily.apparent_temperature_min[0];
      const maxUVIndex = data.daily.uv_index_max[0];
      const precipitationChance = data.daily.precipitation_probability_max[0];
      const windspeed = data.daily.wind_speed_10m_max[0];
      const percipitationsum = data.daily.precipitation_sum[0];
      const cloudcover = data.daily.cloud_cover_mean[0];

      // Now call the logic function to make weather-based decisions
      makeWeatherChoices(maxTemperature, minTemperature, maxUVIndex, precipitationChance, windspeed, percipitationsum, cloudcover);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});