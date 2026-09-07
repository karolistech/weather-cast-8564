import { type WeatherCurrent, getWeatherCondition, getWeatherIcon } from "@/api/weather";

import "./WeatherCurrent.css";

type WeatherCurrentProps = {
  current: WeatherCurrent;
};

export default function WeatherCurrent({ current }: WeatherCurrentProps) {
  const condition = getWeatherCondition(current.weatherCode, current.isDay);
  const icon = getWeatherIcon(condition.icon);

  return (
    <div className="weather-current">
      <div className="weather-current__summary">
        <img src={icon} alt={condition.description} className="weather-current__icon" />

        <div className="weather-current__summary-data">
          <span className="weather-current__temp">
            {current.temp} {current.tempUnit}
          </span>

          <p className="weather-current__condition">
            {condition.description}
          </p>
        </div>
      </div>
    </div>
  );
}
