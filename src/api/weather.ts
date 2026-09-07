import type { Location } from "@/types/locations";
import type { TempUnit } from "@/types/tempUnit";

const icons = import.meta.glob<string>("@/assets/icons/weather-icons/*.svg", {
  import: "default",
  eager: true
});

export type WeatherLocation = {
  name: string;
  timezone: string;
};

export type WeatherCurrent = {
  weatherCode: number;
  isDay: boolean;
  temp: number;
  tempUnit: string;
  apparentTemp: number;
  maxTemp: number;
  minTemp: number;
  sunrise: string;
  sunset: string;
  rainChance: number;
  humidity: number;
  cloudCover: number;
  uvIndex: number;
  windSpeed: number;
  surfacePressure: number;
};

export type WeatherHourly = {
  dateTime: string;
  temp: number;
  rainChance: number;
};

export type WeatherDaily = {
  date: string;
  weatherCode: number;
  maxTemp: number;
  minTemp: number;
  rainChance: number;
};

export type Weather = {
  location: WeatherLocation;
  current: WeatherCurrent;
  hourly: WeatherHourly[];
  daily: WeatherDaily[];
};

type WeatherResponse = {
  timezone: string;

  current_units: {
    temperature_2m: string;
  };

  current: {
    time: string;
    weather_code: number;
    is_day: number;
    temperature_2m: number;
    apparent_temperature: number;
    precipitation_probability: number;
    relative_humidity_2m: number;
    cloud_cover: number;
    uv_index: number;
    wind_speed_10m: number;
    surface_pressure: number;
  };

  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
  };

  daily: {
    time: string[];
    sunrise: string[];
    sunset: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
};

const baseUrl = "https://api.open-meteo.com/v1/forecast";

export async function fetchWeather(location: Location, tempUnit: TempUnit): Promise<Weather> {
  const params = new URLSearchParams();

  params.set("latitude", String(location.lat));
  params.set("longitude", String(location.lon));

  params.set("timezone", "auto");
  params.set("temperature_unit", tempUnit);
  params.set("wind_speed_unit", "ms");

  params.set("current", [
    "weather_code", "is_day", "temperature_2m", "apparent_temperature",
    "precipitation_probability", "relative_humidity_2m", "cloud_cover", "uv_index",
    "wind_speed_10m", "surface_pressure"
  ].join(","));

  params.set("hourly", ["temperature_2m", "precipitation_probability"].join(","));

  params.set("daily", [
    "sunrise", "sunset", "weather_code", "temperature_2m_max", "temperature_2m_min",
    "precipitation_probability_max"
  ].join(","));

  const response = await fetch(`${baseUrl}?${params}`);

  if (!response.ok) {
    throw new Error(`Weather request failed with the status code ${response.status}`);
  }

  const data: WeatherResponse = await response.json();

  const { timezone, current_units, current, hourly, daily } = data;

  const localTime = new Date(current.time);
  const startIndex = hourly.time.findIndex(time => new Date(time) > localTime);

  return {
    location: {
      name: location.name,
      timezone: timezone
    },

    current: {
      weatherCode: current.weather_code,
      isDay: current.is_day === 1,
      temp: current.temperature_2m,
      tempUnit: current_units.temperature_2m,
      apparentTemp: current.apparent_temperature,
      maxTemp: daily.temperature_2m_max[0],
      minTemp: daily.temperature_2m_min[0],
      sunrise: daily.sunrise[0],
      sunset: daily.sunset[0],
      rainChance: current.precipitation_probability,
      humidity: current.relative_humidity_2m,
      cloudCover: current.cloud_cover,
      uvIndex: current.uv_index,
      windSpeed: current.wind_speed_10m,
      surfacePressure: current.surface_pressure
    },

    hourly: Array.from({ length: 7 }, (_, i) => ({
      dateTime: hourly.time[startIndex + i * 2],
      temp: hourly.temperature_2m[startIndex + i * 2],
      rainChance: hourly.precipitation_probability[startIndex + i * 2]
    })),

    daily: Array.from({ length: 7 }, (_, i) => ({
      date: daily.time[i],
      weatherCode: daily.weather_code[i],
      maxTemp: daily.temperature_2m_max[i],
      minTemp: daily.temperature_2m_min[i],
      rainChance: daily.precipitation_probability_max[i]
    }))
  };
}

export function getWeatherCondition(code: number, isDay: boolean): { description: string, icon: string } {
  const conditions = [
    { code: 0, description: "Clear", icon: "clear" },
    { code: 1, description: "Mainly clear", icon: "clear" },
    { code: 2, description: "Partly cloudy", icon: "partly-cloudy" },
    { code: 3, description: "Overcast", icon: "overcast" },

    { code: 45, description: "Foggy", icon: "fog" },
    { code: 48, description: "Freezing fog", icon: "fog-freezing" },

    { code: 51, description: "Light drizzle", icon: "rain" },
    { code: 53, description: "Moderate drizzle", icon: "rain" },
    { code: 55, description: "Heavy drizzle", icon: "rain-heavy" },

    { code: 56, description: "Light freezing drizzle", icon: "rain" },
    { code: 57, description: "Heavy freezing drizzle", icon: "rain-heavy" },

    { code: 61, description: "Light rain", icon: "rain" },
    { code: 63, description: "Moderate rain", icon: "rain" },
    { code: 65, description: "Heavy rain", icon: "rain-heavy" },

    { code: 66, description: "Light freezing rain", icon: "rain" },
    { code: 67, description: "Heavy freezing rain", icon: "rain-heavy" },

    { code: 71, description: "Light snow", icon: "snow" },
    { code: 73, description: "Moderate snow", icon: "snow" },
    { code: 75, description: "Heavy snow", icon: "snow" },
    { code: 77, description: "Snow grains", icon: "snow-grains" },

    { code: 80, description: "Light rain showers", icon: "rain" },
    { code: 81, description: "Moderate rain showers", icon: "rain" },
    { code: 82, description: "Heavy rain showers", icon: "rain-heavy" },

    { code: 85, description: "Light snow showers", icon: "snow-showers" },
    { code: 86, description: "Heavy snow showers", icon: "snow-showers-heavy" },

    { code: 95, description: "Thunderstorm", icon: "thunderstorm" },
    { code: 96, description: "Thunderstorm with hail", icon: "thunderstorm-hail" },
    { code: 99, description: "Thunderstorm with heavy hail", icon: "thunderstorm-hail" }
  ];

  const condition = conditions.find(condition => condition.code === code);

  if (condition === undefined) {
    throw new Error(`Weather code "${code}" was not found`);
  }

  const prefix = isDay ? "day-" : "night-";

  return {
    description: condition.description,
    icon: `${prefix}${condition.icon}`
  };
}

export function getWeatherIcon(name: string): string {
  const key = Object.keys(icons).find(key => key.endsWith(`/weather-icons/${name}.svg`));

  if (key === undefined) {
    throw new Error(`Weather icon "${name}" was not found`);
  }

  return icons[key];
}
