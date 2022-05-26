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
  console.log(respond);
  document.querySelector(`#description`).innerHTML =
    respond.data.weather[0].description;
  iconElement.setAttribute(
    "src",
    ` http://openweathermap.org/img/wn/${respond.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", respond.data.weather[0].description);
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
function lookUp(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

let citySearch = document.querySelector("#search-form");
citySearch.addEventListener("submit", lookUp);
search("San Francisco");
