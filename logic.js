const show = document.getElementById("test_show");

navigator.geolocation.getCurrentPosition(position => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  // Function that handles the weather-based decision logic
function makeWeatherChoices(maxTemperature, minTemperature, maxUVIndex, precipitationChance, windspeed, percipitationsum, cloudcover) {
  let message = `Max Temp: ${maxTemperature}°C, Min Temp: ${minTemperature}°C <br> Max UV Index: ${maxUVIndex} <br> Precipitation Chance: ${precipitationChance}%, Percipitation: ${percipitationsum}mm <br>  Max Wind Speed: ${windspeed}km/h <br> Cloud Cover: ${cloudcover}%`;

  // Make decisions based on weather conditions
  if (maxTemperature > 20) {
    message += `<br> It will be warm outside today. Remember to stay hydrated.`;
  } 

  if (maxTemperature > 40){
    message += `<br> It will be very hot today. Plan accordingly.`
  } else if (maxTemperature > 30){
    message += `<br> It will be quite hot today. Consider dressing lightly.`
  } else if (maxTemperature > 25){
    message += `<br> It will be hot today. Consider wearing something fresh.`
  }
  
  if (minTemperature < -10){
    message += `<br> It could be quite cold today. Remember to layer up.`
  } else if (minTemperature < 0){
    message += `<br> Temperatures could go below 0°C today. Consider bringing some gloves or a scarf.`
  } else if (minTemperature < 10){
    message += `<br> It could be cold today. Consider bringing a jacket.`
  } else if (minTemperature < 15){
    message += `<br> It could be a bit fresh today. Consider bringing a Pullover.`;
  }

  if (maxUVIndex > 4){
    message += `<br> It is imperative you wear sunscreen today.`
  } else if (maxUVIndex > 3){
    message += `<br> It is highly recomended you wear sunscreen today.`
  } else if (maxUVIndex > 2){
    message += `<br> Rememeber to wear sunscreen today.`
  }

  if (precipitationChance > 25 && windspeed > 10){
    message += `<br> There is a good chance of percipitation today and it might get windy. Bring a raincoat.`
  }
  if (precipitationChance > 25 && windspeed < 10){
    message += `<br> There is a good chance of percipitation today. Bring an umbrella or a raincoat.`
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