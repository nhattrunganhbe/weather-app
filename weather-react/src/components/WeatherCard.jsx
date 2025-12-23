function WeatherCard({ data }) {
  if (!data) return null;

  const {
    name,
    main: { temp, humidity, feels_like },
    weather,
    wind,
  } = data;

  const description = weather[0].description;
  const icon = weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <div className="weather-card">
      <h2>{name}</h2>
      <img src={iconUrl} alt={description} />
      <p className="temp">{Math.round(temp)}°C</p>
      <p className="description">{description}</p>

      <div className="details">
        <p>Feels like: {Math.round(feels_like)}°C</p>
        <p>Humidity: {humidity}%</p>
        <p>Wind: {wind.speed} m/s</p>
      </div>
    </div>
  );
}

export default WeatherCard;
