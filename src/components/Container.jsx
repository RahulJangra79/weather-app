import React, { useState } from "react";
import "./Container.css";
import axios from "axios";

// Import your custom icons
import clearIcon from "../assets/clear.svg";
import cloudsIcon from "../assets/clouds.svg";
import rainIcon from "../assets/rain.svg";
import snowIcon from "../assets/snow.svg";
import thunderIcon from "../assets/thunder.svg";
import mistIcon from "../assets/mist.svg";

const API_KEY = "cd6b63922bf69352630b07b3ec50cc05";

// Mapping OpenWeather conditions to your icons
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

  // const fetchWeather = async () => {
  //   if (!city) {
  //     setError("Please enter a city name");
  //     return;
  //   }
  //   try {
  //     setError("");
  //     const response = await fetch(
  //       `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
  //     );
  //     const data = await response.json();

  //     if (data.cod === 200 || data.cod === "200") {
  //       setWeather({
  //         temp: data.main.temp,
  //         desc: data.weather[0].description,
  //         main: data.weather[0].main,
  //         icon: weatherIcons[data.weather[0].main] || defaultIcon,
  //       });
  //     } else {
  //       setError(data.message || "City not found!");
  //       setWeather(null);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setError("Something went wrong!");
  //   }
  // };

  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city name");
      return;
    }

    // Create a ref to store the AbortController
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
          signal: controller.signal, // Pass the signal to Axios
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

    // Return controller so you can cancel request from outside if needed
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
