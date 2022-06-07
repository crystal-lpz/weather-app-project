function updateTime(timezone) {
  let time = document.querySelector("#time-placement");
  let currentTime = document.querySelector("#last-update");
  let timePLace = luxon.DateTime.now().setZone(timezone);
  let currentPlace = luxon.DateTime.now();
  time.innerHTML = timePLace.toFormat(`cccc hh:mm a`);
  currentTime.innerHTML = currentPlace.toFormat(`DDDD hh:mm a`);
}

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
          class="weather-forecast-img"
        />
       <div class="temperature-forecast">
         <span class="weather-forecast-temp-max">${Math.round(
           forecastDay.temp.max
         )}</span>°
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
  document.querySelector("#max-temp").innerHTML = Math.round(
    respond.data.main.temp_max
  );
  document.querySelector("#min-temp").innerHTML = Math.round(
    respond.data.main.temp_min
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
function displayFahrenheitTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

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

function lookUp(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

let fahrenheitTemperature = null;
let celsiusTemperature = null;
let forecastMinTemp = null;
let forecastMaxTemp = null;

let citySearch = document.querySelector("#search-form");
citySearch.addEventListener("submit", lookUp);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

search("New York");
