// Date
function updateTime(timezone) {
  let time = document.querySelector("#time-placement");
  let currentTime = document.querySelector("#last-update");
  let timePLace = luxon.DateTime.now().setZone(timezone);
  let currentPlace = luxon.DateTime.now();
  time.innerHTML = timePLace.toFormat(`cccc HH:mm`);
  currentTime.innerHTML = currentPlace.toFormat(`DDDD HH:mm`);
}

// Day forecast
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  return days[day];
}
// Daily forecast
function displayForecast(respond) {
  let forecast = respond.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = ` <div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 7) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
       <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        <img
        
          src="/img/${forecastDay.weather[0].icon}.svg"
          alt=""
          width="42"
          class="weather-forecast-icon"
        />
       <div class="temperature-forecast">
         <span class="weather-forecast-temp-max">${Math.round(
           forecastDay.temp.max
         )} </span>°
         <span class="weather-forecast-temp-min">${Math.round(
           forecastDay.temp.min
         )}</span>°
       </div>
     </div>
   `;
    }
    forecastMinTemp = forecastDay.temp.min;
    forecastMaxTemp = forecastDay.temp.max;
  });
  forecastHTML = forecastHTML + ` </div>`;
  forecastElement.innerHTML = forecastHTML;
  updateTime(respond.data.timezone);
}

// Coordinates for forecast
function getForecast(coordinates) {
  let apiKey = "ca32155fa8562e7d4743f24dd7e13dc9";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}

// Display Temperature and Info
function showTemperature(respond) {
  let iconElement = document.querySelector("#icon");
  let mainTemp = document.querySelector("#main-temp");
  let humidity = document.querySelector("#humidity");
  let city = document.querySelector(`h1`);
  let windSpeed = document.querySelector("#wind-speed");
  let maxTemp = document.querySelector("#max-temp");
  let minTemp = document.querySelector("#min-temp");
  let description = document.querySelector(`#description`);

  city.innerHTML = respond.data.name;
  humidity.innerHTML = respond.data.main.humidity;
  windSpeed.innerHTML = Math.round(respond.data.wind.speed);
  maxTemp.innerHTML = Math.round(respond.data.main.temp_max);
  minTemp.innerHTML = Math.round(respond.data.main.temp_min);
  description.innerHTML = respond.data.weather[0].description;
  mainTemp.innerHTML = Math.round(respond.data.main.temp);

  // iconElement.setAttribute(
  //   "src",
  //   ` http://openweathermap.org/img/wn/${respond.data.weather[0].icon}@2x.png`
  // );
  iconElement.setAttribute(`src`, `/img/${respond.data.weather[0].icon}.svg`);

  iconElement.setAttribute("alt", respond.data.weather[0].description);

  fahrenheitTemperature = respond.data.main.temp;
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  celsiusLink.addEventListener("click", displayCelsiusTemperature);
  fahrenheitLink.removeEventListener("click", displayFahrenheitTemperature);

  // Calling Coordinates for forecast
  getForecast(respond.data.coord);
}

// Current Position Button + geolocation
function showPosition(position) {
  let apiKey = "ca32155fa8562e7d4743f24dd7e13dc9";
  let imperialUnit = "imperial";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let baseLink = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrl = `${baseLink}lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${imperialUnit}`;

  axios.get(apiUrl).then(showTemperature);
}

// Navigator Geolocation
function getCurrentPosition(event) {
  event.preventDefault();

  navigator.geolocation.getCurrentPosition(showPosition);
}
// Button for current location
let button = document.querySelector("#current-location");
button.addEventListener("click", getCurrentPosition);

// axios API
function search(city) {
  let apiKey = "ca32155fa8562e7d4743f24dd7e13dc9";
  let imperialUnit = "imperial";
  let baseLink = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrl = `${baseLink}q=${city}&appid=${apiKey}&units=${imperialUnit}`;
  axios.get(apiUrl).then(showTemperature);
}

//// Celcius////
function displayCelsiusTemperature(event) {
  event.preventDefault();
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");

  //WindSpeed
  let unitWindspeed = document.querySelector(`#windspeed-unit`);
  let metricWindspeed = `km/h`;
  let windSpeed = document.querySelector("#wind-speed");
  let windSpeedNumber = windSpeed.innerHTML;
  let kilometres = Math.round(windSpeedNumber * 1.609);
  windSpeed.innerHTML = `${kilometres}`;
  unitWindspeed.innerHTML = `${metricWindspeed}`;

  //Max Temperature
  let maxTemp = document.querySelector("#max-temp");
  let maxTempNumber = maxTemp.innerHTML;
  let celsiusMaxTemp = ((maxTempNumber - 32) * 5) / 9;
  maxTemp.innerHTML = Math.round(celsiusMaxTemp);

  //Min Temperature
  let minTemp = document.querySelector("#min-temp");
  let minTempNumber = minTemp.innerHTML;
  let celsiusMinTemp = ((minTempNumber - 32) * 5) / 9;
  minTemp.innerHTML = Math.round(celsiusMinTemp);

  //Celsius Temperature
  let celsiusTemperature = ((fahrenheitTemperature - 32) * 5) / 9;
  let temperatureElement = document.querySelector("#main-temp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  let forecastMin = document.querySelectorAll(".weather-forecast-temp-min");
  forecastMin.forEach(function (item) {
    let currentMin = item.innerHTML;
    let celsius = Math.round(((currentMin - 32) * 5) / 9);
    item.innerHTML = celsius;
  });

  let forecastMax = document.querySelectorAll(".weather-forecast-temp-max");
  forecastMax.forEach(function (item) {
    let currentMin = item.innerHTML;
    let celsius = Math.round(((currentMin - 32) * 5) / 9);
    item.innerHTML = celsius;
  });
  celsiusLink.removeEventListener("click", displayCelsiusTemperature);
  fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);
}

//// Fahrenheit////
function displayFahrenheitTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

  //WindSpeed
  let unitWindspeed = document.querySelector(`#windspeed-unit`);
  let imperialWindspeed = `mph`;
  let windSpeed = document.querySelector("#wind-speed");
  let windSpeedNumber = windSpeed.innerHTML;
  let kilometres = Math.round(windSpeedNumber / 1.609);
  windSpeed.innerHTML = `${kilometres}`;
  unitWindspeed.innerHTML = `${imperialWindspeed}`;

  //Max Temperature
  let maxTemp = document.querySelector("#max-temp");
  let maxTempNumber = maxTemp.innerHTML;
  let celsiusMaxTemp = (maxTempNumber * 9) / 5 + 32;
  maxTemp.innerHTML = Math.round(celsiusMaxTemp);

  //Min Temperature
  let minTemp = document.querySelector("#min-temp");
  let minTempNumber = minTemp.innerHTML;
  let celsiusMinTemp = (minTempNumber * 9) / 5 + 32;
  minTemp.innerHTML = Math.round(celsiusMinTemp);

  // Fahrenheit Temperature
  let temperatureElement = document.querySelector("#main-temp");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);

  let forecastMin = document.querySelectorAll(".weather-forecast-temp-min");
  forecastMin.forEach(function (item) {
    let currentMin = item.innerHTML;
    let celsius = Math.round((currentMin * 9) / 5 + 32);
    item.innerHTML = celsius;
  });

  let forecastMax = document.querySelectorAll(".weather-forecast-temp-max");
  forecastMax.forEach(function (item) {
    let currentMin = item.innerHTML;
    let fahrenheit = Math.round((currentMin * 9) / 5 + 32);
    item.innerHTML = fahrenheit;
  });
  fahrenheitLink.removeEventListener("click", displayFahrenheitTemperature);
  celsiusLink.addEventListener("click", displayCelsiusTemperature);
}

// API response Searching City name
function lookUp(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

let fahrenheitTemperature = null;
let celsiusTemperature = null;
let forecastMinTemp = null;
let forecastMaxTemp = null;

// Calling function (lookup)
let citySearch = document.querySelector("#search-form");
citySearch.addEventListener("submit", lookUp);

//Calling function (Celcius)
let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

// Calling function (Fahrenheit)
let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

search("new york");
