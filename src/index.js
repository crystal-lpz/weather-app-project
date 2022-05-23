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
  let number = date.getDate();
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${number}, ${hours}:${minutes} `;
}
let date = document.querySelector(".subHeader");
let currentTime = new Date();
date.innerHTML = formatDate(currentTime);

function showTemperature(respond) {
  document.querySelector(`h1`).innerHTML = respond.data.name;
  document.querySelector("#main-temp").innerHTML = Math.round(
    respond.data.main.temp
  );
  document.querySelector("#humidity").innerHTML = respond.data.main.humidity;
  document.querySelector("#wind-speed").innerHTML = Math.round(
    respond.data.wind.speed
  );
  speed.innerHTML = `${windSpeed}`;
  document.querySelector(`#description`).innerHTML =
    respond.data.weather[0].description;
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

function lookUp(event) {
  event.preventDefault();
  let apiKey = "ca32155fa8562e7d4743f24dd7e13dc9";
  let imperialUnit = "imperial";
  let input = document.querySelector("#city-input");
  let baseLink = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrl = `${baseLink}q=${input.value}&appid=${apiKey}&units=${imperialUnit}`;
  axios.get(apiUrl).then(showTemperature);
}

let citySearch = document.querySelector("#search-form");
citySearch.addEventListener("submit", lookUp);
