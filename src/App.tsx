import { useState } from "react";
import axios from "axios";
import "./App.css";
import WeatherCard from "./components/WeatherCard/WeatherCard";

function App() {
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [city, setCity] = useState("");
  const [weatherInfo, setWeatherInfo] = useState({});
  const [cityInfo, setCityInfo] = useState({});
  const [units, setUnits] = useState("metric");
  const getWeather = async () => {
    try {
      console.log("Getting city info!");
      setLoading(true);
      let cityRequest = await axios.get(
        "http://api.openweathermap.org/geo/1.0/direct",
        {
          params: {
            q: city,
            appid: "3c612a60dd52c1d5a2814730bfc1a60a",
            limit: "2",
          },
        }
      );
      console.log("Received city info: ", cityRequest.data[0].name);
      let lat = cityRequest.data[0].lat;
      let lon = cityRequest.data[0].lon;
      let weatherHit = await axios.get(
        "https://api.openweathermap.org/data/2.5/forecast",
        {
          params: {
            lat: lat,
            lon: lon,
            appid: "3c612a60dd52c1d5a2814730bfc1a60a",
            units: units,
          },
        }
      );
      console.log("Received new weather!", weatherHit.data);
      setWeatherInfo([...weatherHit.data.list]);
      setCityInfo(weatherHit.data.city);
      setDataFetched(true);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="app-container">
      <div className="controls-cntr">
        <select
          className="unit-dropdown"
          value={units}
          onChange={(e) => {
            setUnits(e.target.value);
            setDataFetched(false);
          }}
        >
          <option value="metric">Celsius (°C)</option>
          <option value="imperial">Fahrenheit (°F)</option>
          <option value="standard">Kelvin (K)</option>
        </select>
      </div>
      <div className="search-bar-cntr">
        <input
          className="search-bar"
          placeholder="Enter the city you'd like the weather of."
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
          }}
        ></input>
        <button className="search-btn" onClick={getWeather}>
          Search
        </button>
      </div>
      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}
      {dataFetched && (
        <WeatherCard
          cityInfo={cityInfo}
          weatherInfo={weatherInfo}
          units={units}
        />
      )}
    </div>
  );
}

export default App;
