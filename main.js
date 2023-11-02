import iconData from './descriptions.js'

const imageUrl = "https://source.unsplash.com/1920x1080/?nature"
let bgElement = document.querySelector("body");
let preloaderImg = document.createElement("img");
preloaderImg.src = imageUrl;

preloaderImg.addEventListener("load", () => {
  bgElement.style.backgroundImage = `url(${imageUrl})`;
  document.body.style.opacity = "1"
  preloaderImg = null;
});

//Functon to fetch locations
const fetchLocation = async (location) => {

  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=6&language=en&format=json`,);
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





const displayMessage = document.getElementById("user-message");

//Function to display locations.
const displayLocations = async (location) => {
  const showLocations = await fetchLocation(location);

  // console.log(showLocations);

  if (showLocations == undefined) {
    console.log("Oh no, theres an error")
    displayMessage.innerText = "Please search by city name"
  }
  else {
    const displayLocation = showLocations.map(item =>
      `<div class="individual-location id="${item.id}"
        data-lat-value=${item.latitude} 
        data-long-value=${item.longitude}>
  
        <div class="">
          <h3>State:</h3>
          <p>${item.admin1} </p>
        </div>
        <br>
        <div class="">
          <h3>Name:</h3>
          <p>${item.name}</p>
        </div>
        <br>
        <div class="">
          <h3>Country:</h3>
          <p>${item.country}</p>
        </div>
        
      </div>`
    ).join("");

    document.querySelector(".parent-container-location").innerHTML = displayLocation;
  };

};


//Function adds clicks to divs and displays weather info
const addHandleLocationClicks = () => {
  document.querySelectorAll(".individual-location").forEach(item => {
    item.addEventListener("click", async () => {
      const lat = item.getAttribute("data-lat-value");
      const long = item.getAttribute("data-long-value");

      // console.log(lat, long);

      const showWeather = await fetchWeather(lat, long);
      // console.log(showWeather);

      await displayWeather(showWeather);

      document.querySelector(".parent-container-location").innerHTML = '';


    });
  });
};




const displayWeather = async (data) => {

  //Display current weather and return to .current-weather div
  const currentWeather = document.querySelector(".current-weather");
  // Add variable for is_day and weathercode and access the data in iconData import from description.js file.
  const timeOfDayResponse = data.current_weather.is_day;
  const weatherCodeResponse = data.current_weather.weathercode;
  const currentTime = data.current_weather.time;
  const timeConverted = new Date(currentTime);
  const [weekday, month, day] = timeConverted.toDateString().split(' ');
  // console.log(weekday, month, day);

  //Check date that is coming into data param and iconData imported from description.js and see if current_weather.is_day = 1 (day) or 0(night) then check weathercode for proper icon day or night.
  const icon = iconData[weatherCodeResponse][timeOfDayResponse];
  const imgSrc = icon.image;
  const description = icon.description;




  //Display current weather
  currentWeather.innerHTML = ` 
  <div>
    <h3 id="weather-main">${weekday} ${month} ${day}</h3>
    <img  src=${imgSrc} alt=${description} />
    <p>${description}</p>
    <br>
    <h3 id="numeric-temp">${data.current_weather.temperature}℉</h3>
    
  </div>`



  //Display 7 day weather from hourly
  const dailyWeather = document.querySelector(".parent-container-daily-weather");

  dailyWeather.innerHTML = '';

  const { time, temperature_2m_max, temperature_2m_min, weathercode } = data.daily;


  time.forEach((item, index) => {
    let date = new Date(item);
    const [weekday, month, day] = date.toDateString().split(' ');
    const dailyWeatherIcon = iconData[weathercode[index]][1];
    const dailyImgSrc = dailyWeatherIcon.image;
    const dailyDescription = dailyWeatherIcon.description;


    dailyWeather.innerHTML +=
      `<div class="individual-daily-weather">
        <h3 class="weather-date">${weekday} ${month} ${day}</h3>
        <br>
        <img  src=${dailyImgSrc} alt=${dailyDescription} />
        <p>${dailyDescription}</p>
        <br>
        <h3 class="weather-high">High ${temperature_2m_max[index]}℉</h3>
        <br>
        <h3 class="weather-low">Low ${temperature_2m_min[index]}℉</h3>
        
      </div>`

  });
};



const form = document.getElementById("form");
const input = document.getElementById("my-input");


form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (displayMessage.textContent) {
    displayMessage.textContent = ''
  }

  document.querySelector(".parent-container-location").innerHTML = '';

  document.querySelector(".parent-container-daily-weather").innerHTML = '';

  document.querySelector(".current-weather").innerHTML = ''

  const submittedValue = input.value;

  await displayLocations(submittedValue);

  addHandleLocationClicks();


  input.value = ''

});









