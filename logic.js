const day_1 = document.getElementById("day_1");
const week = document.getElementById("week");

let selectedLatitude = null;
let selectedLongitude = null;

// Show local weather on page load
window.addEventListener('load', () => {
  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetchWeather(lat, lon);
  }, error => {
    console.warn('Geolocation failed or denied. No weather shown.');
  });
});

// Weekly recommendation logic
function makeWeeklyRecommendations(maxTemp, minTemp, maxUV, maxPrecipChance, maxWind, totalPrecipSum, minCloudCover) {
  let message = `Based on the most extreme conditions forecasted this week, here’s what to prepare for:<br>`;

  if (maxTemp > 40) {
    message += `<br>It could get *very* hot this week. Plan accordingly.`;
  } else if (maxTemp > 30) {
    message += `<br>There will be some quite hot days. Dress lightly and stay cool.`;
  } else if (maxTemp > 25) {
    message += `<br>Expect some warm weather. Stay hydrated and wear breathable clothes.`;
  }

  if (minTemp < -10) {
    message += `<br>It might get extremely cold. Bundle up and wear multiple layers.`;
  } else if (minTemp < 0) {
    message += `<br>There could be freezing temperatures. Bring gloves, scarves, and warm clothing.`;
  } else if (minTemp < 10) {
    message += `<br>Some days will be chilly. Consider wearing a jacket.`;
  } else if (minTemp < 15) {
    message += `<br>It may feel a bit fresh some mornings. A pullover might come in handy.`;
  }

  if (maxUV > 4) {
    message += `<br>UV levels could get high. Make sure to wear sunscreen.`;
  } else if (maxUV > 3) {
    message += `<br>Some days may have moderate UV. Sunscreen is recommended.`;
  }

  if (maxPrecipChance > 25 && maxWind > 10) {
    message += `<br>It may be rainy *and* windy. Bring a raincoat instead of an umbrella.`;
  } else if (maxPrecipChance > 25) {
    message += `<br>Rain is likely on some days. Keep an umbrella or raincoat nearby.`;
  }

  if (minCloudCover < 30) {
    message += `<br>There will be some bright days. Sunglasses or a cap might help.`;
  }

  message += `<br><br><strong>Weekly Extremes:</strong><br>`;
  message += `Max Temp: ${maxTemp}°C, Min Temp: ${minTemp}°C<br>`;
  message += `Max UV Index: ${maxUV}<br>`;
  message += `Max Precipitation Chance: ${maxPrecipChance}%, Total Precipitation: ${totalPrecipSum}mm<br>`;
  message += `Max Wind Speed: ${maxWind}km/h<br>`;
  message += `Minimum Cloud Cover: ${minCloudCover}%<br>`;

  week.innerHTML = message;
}

function makeWeatherChoices(maxTemperature, minTemperature, maxUVIndex, precipitationChance, windspeed, percipitationsum, cloudcover, date) {
  let message = `<strong>${date}</strong><br>`;
  message += `According to the conditions, the following is recommended:<br>`;

  if (maxTemperature > 20) message += `<br>It will be warm outside. Remember to stay hydrated.`;
  if (maxTemperature > 40) message += `<br>It will be very hot. Plan accordingly.`;
  else if (maxTemperature > 30) message += `<br>It will be quite hot. Consider dressing lightly.`;
  else if (maxTemperature > 25) message += `<br>It will be hot. Consider wearing something fresh.`;

  if (minTemperature < -10) message += `<br>It could be quite cold. Remember to layer up.`;
  else if (minTemperature < 0) message += `<br>Temperatures could go below 0°C. Consider bringing gloves or a scarf.`;
  else if (minTemperature < 10) message += `<br>It could be cold. Consider bringing a jacket.`;
  else if (minTemperature < 15) message += `<br>It could be a bit fresh. Consider bringing a pullover.`;

  if (maxUVIndex > 4) message += `<br>It is imperative you wear sunscreen.`;
  else if (maxUVIndex > 3) message += `<br>It is highly recommended you wear sunscreen.`;
  else if (maxUVIndex > 2) message += `<br>Remember to wear sunscreen.`;

  if (precipitationChance > 25 && windspeed > 10)
    message += `<br>There is a good chance of precipitation and it might get windy. Bring a raincoat.`;
  else if (precipitationChance > 25)
    message += `<br>There is a good chance of precipitation. Bring an umbrella or a raincoat.`;

  if (cloudcover < 30) message += `<br>It could get quite bright. Bring sunglasses or a cap.`;

  message += `<br><br>Max Temp: ${maxTemperature}°C, Min Temp: ${minTemperature}°C<br>`;
  message += `Max UV Index: ${maxUVIndex}<br>`;
  message += `Precipitation Chance: ${precipitationChance}%, Sum: ${percipitationsum}mm<br>`;
  message += `Max Wind Speed: ${windspeed}km/h<br>`;
  message += `Cloud Cover: ${cloudcover}%<br>`;

  return message;
}

const input = document.getElementById('cityInput');
const suggestionsDiv = document.getElementById('suggestions');
const result = document.getElementById('result');

input.addEventListener('input', async () => {
  const query = input.value.trim();
  if (query.length < 2) {
    suggestionsDiv.innerHTML = '';
    return;
  }

  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`);
  const data = await response.json();

  suggestionsDiv.innerHTML = '';
  if (!data.results) return;

  data.results.forEach(place => {
    const div = document.createElement('div');
    div.textContent = `${place.name}, ${place.country}`;
    div.classList.add('suggestion');
    div.addEventListener('click', () => {
      input.value = `${place.name}, ${place.country}`;
      suggestionsDiv.innerHTML = '';
      selectedLatitude = place.latitude;
      selectedLongitude = place.longitude;
      fetchWeather(selectedLatitude, selectedLongitude); // fetch on selection
    });
    suggestionsDiv.appendChild(div);
  });
});

// Close suggestions on outside click
document.addEventListener('click', (e) => {
  if (!suggestionsDiv.contains(e.target) && e.target !== input) {
    suggestionsDiv.innerHTML = '';
  }
});

// Fetch weather (used both for local and selected city)
function fetchWeather(latitude, longitude) {
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=apparent_temperature_max,apparent_temperature_min,wind_speed_10m_max,uv_index_max,precipitation_sum,precipitation_probability_max,cloud_cover_mean&timezone=auto`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const todayMessage = makeWeatherChoices(
        data.daily.apparent_temperature_max[0],
        data.daily.apparent_temperature_min[0],
        data.daily.uv_index_max[0],
        data.daily.precipitation_probability_max[0],
        data.daily.wind_speed_10m_max[0],
        data.daily.precipitation_sum[0],
        data.daily.cloud_cover_mean[0],
        "Today"
      );
      day_1.innerHTML = todayMessage;

      const maxTemp = Math.max(...data.daily.apparent_temperature_max);
      const minTemp = Math.min(...data.daily.apparent_temperature_min);
      const maxUV = Math.max(...data.daily.uv_index_max);
      const maxPrecipChance = Math.max(...data.daily.precipitation_probability_max);
      const maxWind = Math.max(...data.daily.wind_speed_10m_max);
      const totalPrecipSum = Math.round(data.daily.precipitation_sum.reduce((sum, val) => sum + val, 0));
      const minCloudCover = Math.min(...data.daily.cloud_cover_mean);

      makeWeeklyRecommendations(maxTemp, minTemp, maxUV, maxPrecipChance, maxWind, totalPrecipSum, minCloudCover);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}