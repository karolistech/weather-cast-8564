import { type WeatherCurrent, getWeatherCondition, getWeatherIcon } from "@/api/weather";

import { formatTime } from "@/utils/formatters";

import "./WeatherCurrent.css";
import uiIcons from "@/assets/icons/ui-icons/ui-icons.svg";

type WeatherCurrentProps = {
  current: WeatherCurrent;
};

type RangeProps = {
  icon: string;
  label: string;
  value: string;
};

type DetailProps = {
  icon: string;
  label: string;
  value: string;
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

      <div className="weather-current__ranges">
        <Range icon="apparent-temp" label="Real Feel" value={`${current.apparentTemp}°`} />
        <Range icon="upwards-arrow" label="Max" value={`${current.maxTemp}°`} />
        <Range icon="downwards-arrow" label="Min" value={`${current.minTemp}°`} />
      </div>

      <div className="weather-current__details">
        <Detail icon="sunrise" label="Sunrise" value={formatTime(current.sunrise)} />
        <Detail icon="sunset" label="Sunset" value={formatTime(current.sunset)} />
        <Detail icon="rain-chance" label="Rain Chance" value={`${current.rainChance}%`} />
        <Detail icon="humidity" label="Humidity" value={`${current.humidity}%`} />
        <Detail icon="cloud-cover" label="Cloud Cover" value={`${current.cloudCover}%`} />
        <Detail icon="uv-index" label="UV Index" value={`${current.uvIndex}`} />
        <Detail icon="wind-speed" label="Wind Speed" value={`${current.windSpeed} m/s`} />
        <Detail icon="surface-pressure" label="Surface Pressure" value={`${current.surfacePressure} hPa`} />
      </div>
    </div>
  );
}

function Range({ icon, label, value }: RangeProps) {
  return (
    <div className="weather-current__range">
      <svg className="weather-current__range-icon">
        <use href={`${uiIcons}#${icon}`} />
      </svg>

      <div className="weather-current__range-data">
        <span className="weather-current__range-label">
          {label}
        </span>

        <span className="weather-current__range-value">
          {value}
        </span>
      </div>
    </div>
  );
}

function Detail({ icon, label, value }: DetailProps) {
  return (
    <div className="weather-current__detail">
      <svg className="weather-current__detail-icon">
        <use href={`${uiIcons}#${icon}`} />
      </svg>

      <div className="weather-current__detail-data">
        <span className="weather-current__detail-label">
          {label}
        </span>

        <span className="weather-current__detail-value">
          {value}
        </span>
      </div>
    </div>
  );
}
