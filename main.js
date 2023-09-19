import './style.css'

//Functon to fetch locations
const fetchLocation = async (location) => {

  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=8&language=en&format=json`,);
    console.log(response)

    if (response.status === 200) {
      const data = await response.json();
      console.log(data);

      const locations = data.results

      return locations;
    }

  }
  catch (error) {
    console.log(error);
  }


};


//Functon to fetch weather
const fetchWeather = async (lat, long) => {

  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&temperature_unit=fahrenheit&timezone=auto`,);
    console.log(response);

    if (response.status === 200) {
      const data = await response.json();
      console.log(data);

      return data;
    }

  }
  catch (error) {
    console.log(error);
  }


};







//Function to display locations.
const displayLocations = async (location) => {
  const showLocations = await fetchLocation(location);

  console.log(showLocations);

  //
  //Handle error here if no results found later
  //


  const displayLocation = showLocations.map(item =>
    `<div class="individual-location id="${item.id}"
      data-lat-value=${item.latitude} 
      data-long-value=${item.longitude}>

      <div class="">
        <h3>State:</h3>
        <p>${item.admin1} </p>
      </div>

      <div class="">
        <h3>Name:</h3>
        <p>${item.name}</p>
      </div>
     
      <div class="">
        <h3>Country:</h3>
        <p>${item.country}</p>
      </div>
      
    </div>`
  ).join("");

  document.querySelector(".parent-container-location").innerHTML = displayLocation;

};


//Adds clicks to divs and displays weather info
function addHandleLocationClicks() {
  document.querySelectorAll(".individual-location").forEach(item => {
    item.addEventListener("click", async () => {
      const lat = item.getAttribute("data-lat-value");
      const long = item.getAttribute("data-long-value");

      console.log(lat, long)

      const showWeather = await fetchWeather(lat, long);
      console.log(showWeather)

      //use displayWeather() here and remove return below.
      // return showWeather
      await displayWeather(showWeather);




    });
  });
};









const displayWeather = async (data) => {
  //use map or forEach to go over hourly weather for 7 days here using #daily-weather

  //Display current weather and return to .current-weather div
  const currentWeather = document.querySelector(".current-weather");
  const currentTime = data.current_weather.time;
  const timeConverted = String(new Date(currentTime));
  currentWeather.innerHTML = ` 
  <div>
    <h3 id="weather-main">${timeConverted}</h3>
    <h3 id="numeric-temp">${data.current_weather.temperature}℉</h3>
    
  </div>`



  //Display 7 day weather from hourly
  const dailyWeather = document.querySelector(".parent-container-daily-weather");

  dailyWeather.innerHTML = '';

  const { time, temperature_2m_max, temperature_2m_min, weathercode } = data.daily;

  time.forEach((item, index) => {
    dailyWeather.innerHTML +=
      `<div class="individual-daily-weather">
        <h3 id="">${item}</h3>
        <h3 id="">${weathercode[index]}</h3>
        <h3 id="">High ${temperature_2m_max[index]}℉</h3>
        <h3 id="">Low ${temperature_2m_min[index]}℉</h3>
        
      </div>`


  });


};






const form = document.getElementById("form");
const input = document.getElementById("my-input");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submittedValue = input.value;

  await displayLocations(submittedValue);

  addHandleLocationClicks();


});









