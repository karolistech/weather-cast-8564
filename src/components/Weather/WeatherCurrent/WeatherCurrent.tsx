import { type WeatherCurrent, getWeatherCondition, getWeatherIcon } from "@/api/weather";

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
