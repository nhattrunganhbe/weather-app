import { API_KEY } from "./config.js";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");

searchBtn.addEventListener("click", getWeather);
async function getWeather() {
  const city = cityInput.value.trim();
  // async là để dùng await (đễ bắt hàm đợi)
  if (!city) {
    weatherResult.innerHTML = "<p>Please enter a city name</p>";
    return;
  }

  searchBtn.disabled = true;
  searchBtn.textContent = "Loading...";
  weatherResult.innerHTML = "<p>Fetching weather data...</p>";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const [response, forecastResponse] = await Promise.all([
      fetch(url),
      fetch(forecastUrl),
    ]);
    if (!response.ok || !forecastResponse.ok) {
      if (response.status === 404) {
        throw new Error("City not found");
      } else if (response.status === 401) {
        throw new Error("Invalid API key");
      } else {
        throw new Error("Failed to fetch weather");
      }
    }

    //  await sẽ dừng hàm đến khi nào thực hiện xong fetch, tức là nó sẽ lấy 1 cái lệnh ở http (hiểu đơn giản là vậy )
    // json() là để chuyển từ json string sang js object (vì HTTP chỉ trả về text)
    // try catch là 1 cái kiểu để tìm ra lỗi

    const data = await response.json();
    const forecastData = await forecastResponse.json();
    console.log(data); // Xem data trong Console
    console.log(forecastData);
    displayWeather(data);
    displayForecast(forecastData);
  } catch (error) {
    weatherResult.innerHTML = `<p class="error">${error.message}</p>`;
    document.getElementById("forecastResult").innerHTML = "";
  } finally {
    // RESET BUTTON STATE
    searchBtn.disabled = false;
    searchBtn.textContent = "Search";
  }
}

function displayWeather(data) {
  const temp = data.main.temp;
  const description = data.weather[0].description;
  const city = data.name;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const feelsLike = data.main.feels_like;
  const icon = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  // trong cái object có chứa 1 object tên là main lấy temp ở trong object đó,
  // name cũng là 1 string nằm trong object
  // có 1 cái array là weather lấy description trong đó

  weatherResult.innerHTML = `<div class="weather-card">
      <h2>${city}</h2>
      <img src="${iconUrl}" alt="${description}">
      <p class="temp">${Math.round(temp)}°C</p>
      <p class="description">${description}</p>
      <div class="details">
        <p>Feels like: ${Math.round(feelsLike)}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind: ${windSpeed} m/s</p>
      </div>
    </div>
  `;
}

function displayForecast(data) {
  const forecastDiv = document.getElementById("forecastResult");

  // Group by day
  const dailyData = {};

  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    if (!dailyData[date]) {
      dailyData[date] = {
        temps: [],
        icons: [],
        descriptions: [],
      };
    }

    dailyData[date].temps.push(item.main.temp);
    dailyData[date].icons.push(item.weather[0].icon);
    dailyData[date].descriptions.push(item.weather[0].description);
  });

  // dailyData là object chứa các object khác trong mỗi object ngày đó có các array
  // Take first 5 days
  const days = Object.keys(dailyData).slice(0, 5);

  let forecastHTML =
    '<div class="forecast-container"><h3>5-Day Forecast</h3><div class="forecast-cards">';

  days.forEach((day) => {
    const temps = dailyData[day].temps;
    const maxTemp = Math.round(Math.max(...temps));
    const minTemp = Math.round(Math.min(...temps));

    // Most common icon
    const icon = dailyData[day].icons[0];
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    // Most common description
    const description = dailyData[day].descriptions[0];

    forecastHTML += `
      <div class="forecast-card">
        <p class="forecast-date">${day}</p>
        <img src="${iconUrl}" alt="${description}">
        <p class="forecast-temp">${minTemp}° - ${maxTemp}°</p>
        <p class="forecast-desc">${description}</p>
      </div>
    `;
  });

  forecastHTML += "</div></div>";
  forecastDiv.innerHTML = forecastHTML;
}
