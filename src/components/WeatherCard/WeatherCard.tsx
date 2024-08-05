import { useEffect, useState } from "react";
import Graph from "../Graph/Graph";
import WeatherIcon from "../WeatherIcon/WeatherIcon";
import "./WeatherCard.css";

export default function WeatherCard({
  cityInfo,
  weatherInfoC,
  weatherInfoF,
}: any) {
  const [showDailyView, setShowDailyView] = useState(false);
  const [dailyAverageTemp, setDailyAverageTemp] = useState<number[]>([]);
  const [singleDayTemps, setSingleDayTemps] = useState<number[]>([]);
  const [singleDayTimes, setSingleDayTimes] = useState<string[]>([]);
  const [dailyWeather, setDailyWeather] = useState<
    {
      icon: string;
      description: string;
      min: number;
      max: number;
    }[]
  >([]);
  const [symbol, setSymbol] = useState("°C");
  const unit_symbols = ["°C", "°F", "K"];
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const date = new Date();
  const [forecastedDays, setForecastedDays] = useState<String[]>([]);
  const img_root = "https://openweathermap.org/img/wn/";

  const generateDate = (offset: number) => {
    let new_date = new Date();
    new_date.setDate(date.getDate() + offset);
    let actual_date = new_date.toISOString().split("T")[0];
    console.log(actual_date);
    return actual_date;
  };

  useEffect(() => {
    let forecastedDaysTemp = [];
    let dailyAverageTemperTemp = [];
    let dailyWeather = [];
    let daysCount = 0;
    let samplesCount = 0;
    let avgTemp = 0;
    let currentWeatherIcon;
    let currentWeather;
    let weatherInfo = symbol === unit_symbols[0] ? weatherInfoC : weatherInfoF;

    for (let i = 0; i < 5; i++) {
      forecastedDaysTemp.push(days[(date.getDay() - 1 + i) % 7]);
    }

    for (let i = 0; i < weatherInfo.length; i++) {
      let temp_date = generateDate(daysCount);
      if (weatherInfo[i].dt_txt.slice(0, temp_date.length) === temp_date) {
        currentWeatherIcon = weatherInfo[i].weather[0].icon;
        currentWeather = weatherInfo[i].weather[0].description;
        currentWeather =
          currentWeather.slice(0, 1).toUpperCase() + currentWeather.slice(1);
        avgTemp += weatherInfo[i].main.temp;
        samplesCount++;
      } else {
        console.log("Inserting: ");
        dailyAverageTemperTemp.push(avgTemp / samplesCount);
        dailyWeather.push({
          icon: currentWeatherIcon,
          description: currentWeather,
          min: weatherInfo[i].main.temp_min,
          max: weatherInfo[i].main.temp_max,
        });
        avgTemp = weatherInfo[i].main.temp;
        samplesCount = 1;
        daysCount++;
      }
    }

    // Sometimes, API returns more than 5 days of data, so it may be that 5 days were encountered,
    // and we don't need to append the final day.
    if (daysCount !== 5) {
      dailyAverageTemperTemp.push(avgTemp / samplesCount);
      dailyWeather.push({
        icon: currentWeatherIcon,
        description: currentWeather,
        min: weatherInfo[weatherInfo.length - 1].main.temp_min,
        max: weatherInfo[weatherInfo.length - 1].main.temp_max,
      });
    }
    // console.log("Calculated daily avg temp: ", dailyAverageTemperTemp);
    // console.log("Calculated forecasted dates: ", forecastedDaysTemp);
    setForecastedDays([...forecastedDaysTemp]);
    setDailyAverageTemp([...dailyAverageTemperTemp]);
    setDailyWeather([...dailyWeather]);
  }, [cityInfo, symbol]);

  const handleViewChange = (_: any, params: any) => {
    if (showDailyView) {
      setShowDailyView(false);
      return;
    }
    let actual_date = generateDate(params.dataIndex);
    let temps = [];
    let dates = [];
    let weatherInfo = symbol === unit_symbols[0] ? weatherInfoC : weatherInfoF;
    for (let i = 0; i < weatherInfo.length; i++) {
      if (weatherInfo[i].dt_txt.slice(0, actual_date.length) === actual_date) {
        dates.push(weatherInfo[i].dt_txt.split(" ")[1]);
        temps.push(weatherInfo[i].main.temp);
      }
    }
    setSingleDayTemps([...temps]);
    setSingleDayTimes([...dates]);
    setShowDailyView(true);
  };

  useEffect(() => {
    console.log(dailyWeather);
    // console.log("Daily avg temp: ", dailyAverageTemp);
  }, [dailyWeather]);

  return (
    <div className="weather-card-cntr">
      <div className="weather-card">
        <div className="current-day-cntr">
          <h2 className="current-day">
            {cityInfo.name + ", " + cityInfo.country}{" "}
          </h2>
          <p>{forecastedDays[0]}</p>
          <p>{dailyWeather[0]?.description}</p>
        </div>
        <div className="misc-info-cntr">
          <div className="current-day-temp">
            <img src={`${img_root}${dailyWeather[0]?.icon}@2x.png`} />
            <h2>{Math.floor(dailyAverageTemp[0])}</h2>
            <p
              className={symbol === unit_symbols[0] ? "txt-underline" : "txt"}
              onClick={() => {
                setSymbol(unit_symbols[0]);
              }}
            >
              °C
            </p>
            <p>|</p>
            <p
              className={symbol === unit_symbols[1] ? "txt-underline" : "txt"}
              onClick={() => {
                setSymbol(unit_symbols[1]);
              }}
            >
              °F
            </p>
          </div>
          <div className="weather-stats-cntr">
            <p>Pressure: {weatherInfoC[0].main.pressure} KPa</p>
            <p>Humidity: {weatherInfoC[0].main.humidity}%</p>
            <p>Wind Speed: {weatherInfoC[0].wind.speed} m/s</p>
          </div>
        </div>
        <div className="forecast-list">
          {forecastedDays.map((item, idx) => {
            return (
              <WeatherIcon
                key={idx}
                day={item}
                iconUrl={`${img_root}${dailyWeather[idx].icon}@2x.png`}
                min={dailyWeather[idx].min}
                max={dailyWeather[idx].max}
                description={dailyWeather[idx].description}
                symbol={symbol}
              />
            );
          })}
        </div>
      </div>
      {!showDailyView && (
        <div className="graph-cntr">
          <Graph
            xAxis={forecastedDays}
            yAxis={dailyAverageTemp}
            type={"Days"}
            units={symbol}
            handleViewChange={handleViewChange}
          />
        </div>
      )}
      {showDailyView && (
        <div className="graph-cntr">
          <button
            className="set-view-btn"
            onClick={() => setShowDailyView(false)}
          >
            Return To Five-Day View
          </button>
          <Graph
            xAxis={singleDayTimes}
            yAxis={singleDayTemps}
            units={symbol}
            type="Time"
          ></Graph>
        </div>
      )}
    </div>
  );
}
