import "./WeatherIcon.css";

export default function WeatherIcon({
  day,
  iconUrl,
  min,
  max,
  description,
  symbol,
}: any) {
  return (
    <div className="weather-icon">
      <h3>{day}</h3>
      <img src={iconUrl} alt={description} className="weather-icon-image" />
      <p className="description">{description + " "}</p>
      <p className="temp-range">
        {Math.floor(min) + symbol + " - " + Math.floor(max) + symbol}
      </p>
    </div>
  );
}
