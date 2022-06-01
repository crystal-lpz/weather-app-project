function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thurday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day}  ${hours}:${minutes} `;
}
let date = document.querySelector(".timeHeader");
let currentTime = new Date();
date.innerHTML = formatDate(currentTime);

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  return days[day];
}
function displayForecast(respond) {
  let forecast = respond.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = ` <div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
       <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
       <div class="temperature-forecast">
         <span class="weather-forecast-temp-max">${Math.round(
           forecastDay.temp.max
         )}°</span>
         <span class="weather-forecast-temp-min">${Math.round(
           forecastDay.temp.min
         )}°</span>
       </div>
     </div>
   `;
    }
  });
  forecastHTML = forecastHTML + ` </div>`;
  forecastElement.innerHTML = forecastHTML;
}
function getForecast(coordinates) {
  let apiKey = "ca32155fa8562e7d4743f24dd7e13dc9";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}
function showTemperature(respond) {
  let iconElement = document.querySelector("#icon");
  document.querySelector(`h1`).innerHTML = respond.data.name;
  document.querySelector("#main-temp").innerHTML = Math.round(
    respond.data.main.temp
  );
  document.querySelector("#humidity").innerHTML = respond.data.main.humidity;
  document.querySelector("#wind-speed").innerHTML = Math.round(
    respond.data.wind.speed
  );

  document.querySelector(`#description`).innerHTML =
    respond.data.weather[0].description;
  iconElement.setAttribute(
    "src",
    ` http://openweathermap.org/img/wn/${respond.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", respond.data.weather[0].description);
  fahrenheitTemperature = respond.data.main.temp;

  getForecast(respond.data.coord);
}

function showPosition(position) {
  let apiKey = "ca32155fa8562e7d4743f24dd7e13dc9";
  let imperialUnit = "imperial";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let baseLink = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrl = `${baseLink}lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${imperialUnit}`;
  axios.get(apiUrl).then(showTemperature);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}
let button = document.querySelector("#current-location");
button.addEventListener("click", getCurrentPosition);

function search(city) {
  let apiKey = "ca32155fa8562e7d4743f24dd7e13dc9";
  let imperialUnit = "imperial";
  let baseLink = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrl = `${baseLink}q=${city}&appid=${apiKey}&units=${imperialUnit}`;
  axios.get(apiUrl).then(showTemperature);
  apiKey = "ca32155fa8562e7d4743f24dd7e13dc9";
}
function displayCelsiusTemperature(event) {
  event.preventDefault();
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  let celsiusTemperature = ((fahrenheitTemperature - 32) * 5) / 9;
  let temperatureElement = document.querySelector("#main-temp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

  let temperatureElement = document.querySelector("#main-temp");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}
function lookUp(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

let fahrenheitTemperature = null;
let citySearch = document.querySelector("#search-form");
citySearch.addEventListener("submit", lookUp);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

search("San Francisco");
