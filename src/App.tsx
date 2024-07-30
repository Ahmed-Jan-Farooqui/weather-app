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
  const [type, setType] = useState("name");
  const getWeather = async () => {
    try {
      console.log("Getting city info!");
      setLoading(true);
      let weatherHit;
      if (type === "name") {
        let cityRequest = await axios.get(
          "https://api.openweathermap.org/geo/1.0/direct",
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
        weatherHit = await axios.get(
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
      } else {
        let zipCode: string,
          countryCode: string = "";
        zipCode = city.split(" ")[0];
        countryCode = city.split(" ")[1];
        weatherHit = await axios.get(
          "https://api.openweathermap.org/data/2.5/forecast",
          {
            params: {
              zip: zipCode + "," + countryCode,
              appid: "3c612a60dd52c1d5a2814730bfc1a60a",
              units: units,
            },
          }
        );
      }
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
        <select
          className="unit-dropdown"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
          }}
        >
          <option value="name">City Name</option>
          <option value="zip">Zip Code and Country Code</option>
        </select>
        <input
          className="search-bar"
          placeholder={
            type === "zip"
              ? "Please enter the ZIP code and Country Code with seperated by a space."
              : "Please enter the name of the city you'd like the weather of."
          }
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
