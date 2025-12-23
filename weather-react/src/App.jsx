import { useEffect, useState } from "react";
import SearchBox from "./components/SearchBox";
import WeatherCard from "./components/WeatherCard";
import ForecastList from "./components/ForecastList";
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

function App() {
  const [cityInput, setCityInput] = useState("");
  const [cityToSearch, setCityToSearch] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    if (!cityToSearch) return;
    if (!API_KEY) {
      setError("Missing API key");
      return;
    }

    async function fetchWeather() {
      try {
        setLoading(true);
        setError(null);

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityToSearch}&appid=${API_KEY}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityToSearch}&appid=${API_KEY}&units=metric`;

        const [weatherRes, forecastRes] = await Promise.all([
          fetch(weatherUrl),
          fetch(forecastUrl),
        ]);

        if (!weatherRes.ok || !forecastRes.ok) {
          throw new Error("City not found");
        }

        const weatherData = await weatherRes.json();
        const forecastData = await forecastRes.json();

        setWeather(weatherData);
        setForecast(forecastData.list);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setWeather(null);
        setForecast([]);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [cityToSearch]);

  return (
    <div className="container">
      <h1>Weather App</h1>

      <SearchBox
        value={cityInput}
        onChange={setCityInput}
        onSearch={() => setCityToSearch(cityInput)}
        loading={loading}
      />

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <WeatherCard data={weather} />
      <ForecastList list={forecast} />
    </div>
  );
}

export default App;

/* Khi cityToSearch thay đổi, useEffect chạy.
Nếu cityToSearch chưa tồn tại thì dừng.
Nếu có, React gọi function async để fetch dữ liệu.
Trước khi fetch, set loading = true và reset error.
Fetch trả về HTTP response, kiểm tra status bằng res.ok.
Nếu lỗi thì throw error → vào catch.
Nếu ok thì parse JSON → setWeather(data).
Dù thành công hay thất bại, finally luôn set loading = false. */
