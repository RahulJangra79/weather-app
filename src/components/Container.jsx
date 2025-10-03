import React, { useState } from "react";
import "./Container.css";
import axios from "axios";

import clearIcon from "../assets/clear.svg";
import cloudsIcon from "../assets/clouds.svg";
import rainIcon from "../assets/rain.svg";
import snowIcon from "../assets/snow.svg";
import thunderIcon from "../assets/thunder.svg";
import mistIcon from "../assets/mist.svg";

const API_KEY = import.meta.env.VITE_API_KEY;

const weatherIcons = {
  Clear: clearIcon,
  Clouds: cloudsIcon,
  Rain: rainIcon,
  Snow: snowIcon,
  Thunderstorm: thunderIcon,
  Mist: mistIcon,
  Smoke: mistIcon,
  Haze: mistIcon,
  Fog: mistIcon,
  Drizzle: rainIcon,
};

const Container = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city name");
      return;
    }

    const controller = new AbortController();

    try {
      setError("");

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            q: city,
            units: "metric",
            appid: API_KEY,
          },
          signal: controller.signal, 
        }
      );

      const data = response.data;

      if (data.cod === 200 || data.cod === "200") {
        setWeather({
          temp: data.main.temp,
          desc: data.weather[0].description,
          main: data.weather[0].main,
          icon: weatherIcons[data.weather[0].main] || defaultIcon,
        });
      } else {
        setError(data.message || "City not found!");
        setWeather(null);
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Request canceled:", err.message);
      } else if (err.response) {
        setError(err.response.data.message || "City not found!");
        setWeather(null);
      } else {
        setError("Something went wrong!");
        setWeather(null);
      }
    }

    return controller;
  };

  return (
    <div className="container">
      {/* search section */}
      <div className="search-section">
        <div className="input-wrapper">
          <span className="material-symbols-rounded">search</span>
          <input
            type="search"
            placeholder="Enter a city name"
            className="search-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <button className="location-button" onClick={fetchWeather}>
          <span className="material-symbols-rounded">my_location</span>
        </button>
      </div>

      {/* weather section */}
      <div className="weather-section">
        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="current-weather">
            <img
              src={weather.icon}
              alt={weather.desc}
              className="Weather-icon"
            />
            <h2 className="temperature">
              {Math.round(weather.temp)}
              <span>°C</span>
            </h2>
            <p className="description">{weather.desc}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Container;
