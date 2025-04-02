const show = document.getElementById("test_show");

navigator.geolocation.getCurrentPosition(position => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  // Fetch the UV index using the user's latitude and longitude
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=uv_index_max`) 
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Convert response to JSON
    })
    .then(data => {
      console.log(data); // Process the JSON data
      const uvIndex = data.daily.uv_index_max[2]; // Assuming you want the third day's UV index (index 2)
      showUV(uvIndex); // Pass the UV index to the showUV function
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