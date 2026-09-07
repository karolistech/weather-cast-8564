import type { Weather } from "@/api/weather";

import WeatherLocation from "./WeatherLocation/WeatherLocation";
import WeatherCurrent from "./WeatherCurrent/WeatherCurrent";

type WeatherProps = {
  weather: Weather;
  updateWeather: () => void;
};

export default function Weather({ weather, updateWeather }: WeatherProps) {
  return (
    <div className="weather">
      <WeatherLocation location={weather.location} updateWeather={updateWeather} />
      <WeatherCurrent current={weather.current} />
    </div>
  );
}
