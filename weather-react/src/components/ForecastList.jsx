function ForecastList({ list }) {
  if (!list || list.length === 0) return null;

  // Group by day
  const dailyData = {};

  list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    if (!dailyData[date]) {
      dailyData[date] = {
        temps: [],
        icon: item.weather[0].icon,
        description: item.weather[0].description,
      };
    }

    dailyData[date].temps.push(item.main.temp);
  });

  const days = Object.keys(dailyData).slice(0, 5);

  return (
    <div className="forecast-container">
      <h3>5-Day Forecast</h3>

      <div className="forecast-cards">
        {days.map((day) => {
          const temps = dailyData[day].temps;
          const min = Math.round(Math.min(...temps));
          const max = Math.round(Math.max(...temps));
          const icon = dailyData[day].icon;
          const description = dailyData[day].description;

          return (
            <div key={day} className="forecast-card">
              <p className="forecast-date">{day}</p>
              <img
                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                alt={description}
              />
              <p className="forecast-temp">
                {min}° – {max}°
              </p>
              <p className="forecast-desc">{description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ForecastList;
