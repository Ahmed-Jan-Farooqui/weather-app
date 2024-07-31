import { useState } from "react";
import axios from "axios";
import "./App.css";
import WeatherCard from "./components/WeatherCard/WeatherCard";
import SearchIcon from "@mui/icons-material/Search";
import { Button, MenuItem, TextField } from "@mui/material";

function App() {
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [city, setCity] = useState("");
  const [weatherInfoC, setWeatherInfoC] = useState({});
  const [weatherInfoF, setWeatherInfoF] = useState({});
  const [cityInfo, setCityInfo] = useState({});
  const [type, setType] = useState("name");
  const getWeather = async () => {
    try {
      setLoading(true);
      let weatherHitC;
      let weatherHitF;
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
        weatherHitC = await axios.get(
          "https://api.openweathermap.org/data/2.5/forecast",
          {
            params: {
              lat: lat,
              lon: lon,
              appid: "3c612a60dd52c1d5a2814730bfc1a60a",
              units: "metric",
            },
          }
        );
        weatherHitF = await axios.get(
          "https://api.openweathermap.org/data/2.5/forecast",
          {
            params: {
              lat: lat,
              lon: lon,
              appid: "3c612a60dd52c1d5a2814730bfc1a60a",
              units: "imperial",
            },
          }
        );
      } else {
        let zipCode: string,
          countryCode: string = "";
        zipCode = city.split(" ")[0];
        countryCode = city.split(" ")[1];
        weatherHitC = await axios.get(
          "https://api.openweathermap.org/data/2.5/forecast",
          {
            params: {
              zip: zipCode + "," + countryCode,
              appid: "3c612a60dd52c1d5a2814730bfc1a60a",
              units: "metric",
            },
          }
        );
        weatherHitF = await axios.get(
          "https://api.openweathermap.org/data/2.5/forecast",
          {
            params: {
              zip: zipCode + "," + countryCode,
              appid: "3c612a60dd52c1d5a2814730bfc1a60a",
              units: "imperial",
            },
          }
        );
      }
      console.log("Received new weather!", weatherHitC.data);
      setWeatherInfoC([...weatherHitC.data.list]);
      setWeatherInfoF([...weatherHitF.data.list]);
      setCityInfo(weatherHitC.data.city);
      setDataFetched(true);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="app-container">
      <div className="search-bar-cntr">
        <TextField
          className="unit-dropdown"
          select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
          }}
          label="Search type"
          InputLabelProps={{ shrink: true }}
        >
          <MenuItem value="name">City Name</MenuItem>
          <MenuItem value="zip">Zip Code and Country Code</MenuItem>
        </TextField>
        <TextField
          className="search-bar"
          label="Search"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
          }}
          InputLabelProps={{ shrink: true }}
          sx={{ width: "60%" }}
        ></TextField>
        <div className="search-btn-cntr">
          <Button
            className="search-btn"
            onClick={getWeather}
            sx={{ height: 1 }}
          >
            <SearchIcon />
          </Button>
        </div>
      </div>

      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}

      {dataFetched && (
        <WeatherCard
          cityInfo={cityInfo}
          weatherInfoC={weatherInfoC}
          weatherInfoF={weatherInfoF}
        />
      )}
    </div>
  );
}

export default App;
