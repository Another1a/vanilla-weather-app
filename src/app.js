function search(city) {
  let apiKey = "40t3642569434232b59fd0dfaf2o59af";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeather);
}

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  return `${day} ${hours}:${minutes}`;
}

function displayWeather(response) {
  let temperature = document.querySelector("#temperature");
  temperature.innerHTML = Math.round(response.data.temperature.current);
  let city = document.querySelector("#city");
  city.innerHTML = response.data.city;
  let description = document.querySelector("#description");
  description.innerHTML = response.data.condition.description;
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = response.data.temperature.humidity;
  let wind = document.querySelector("#wind");
  wind.innerHTML = response.data.wind.speed;
  let date = document.querySelector("#date");
  date.innerHTML = formatDate(response.data.time * 1000);
  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );

  icon.setAttribute("alt", response.data.condition.description);
  celsiusTemperature = response.data.temperature.current;
  getForecast(response.data.coordinates);
}

function searchWeather(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-input");

  search(cityInput.value);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  let day = date.getDay();
  return days[day];
}

function displayForecast(response) {
  console.log(response.data);
  let forecastElement = document.querySelector("#forecast");
  let forecastHtml = `<div class="row">`;

  let forecast = response.data.daily;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHtml =
        forecastHtml +
        `<div class="col-2">
                <div class="weather-forecast-day">${formatDay(
                  forecastDay.time
                )}</div>

                <img
                  src= "http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                    forecastDay.condition.icon
                  }.png";
                   alt=""
                   width="42"
                 
                />
                <div class="weather-forecast-temp">
                  <span class="weather-forecast-temp-max">${Math.round(
                    forecastDay.temperature.maximum
                  )}° </span>
                  <span class="weather-forecast-temp-min">${Math.round(
                    forecastDay.temperature.minimum
                  )}°</span>
                </div>
              </div>`;
    }
  });
  forecastHtml = forecastHtml + `</div>`;
  forecastElement.innerHTML = forecastHtml;
}

function getForecast(coordinates) {
  let apiKey = "40t3642569434232b59fd0dfaf2o59af";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayFahrenheitTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsuisLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheit = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheit);
}

function displayCelsiusTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsuisLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", searchWeather);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

let celsuisLink = document.querySelector("#celsius-link");
celsuisLink.addEventListener("click", displayCelsiusTemp);

search("Singapore");
