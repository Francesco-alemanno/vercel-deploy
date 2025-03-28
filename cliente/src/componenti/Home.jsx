import { useEffect, useState } from "react";
import useSWR from "swr";
import "/css/home.css"; 

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function Home() {
  const [searchCity, setSearchCity] = useState("");
  const [customCity, setCustomCity] = useState(null);

  const getProfile = async () => {
    const token = localStorage.getItem("token");
    await fetch("http://localhost:5001/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
  };

  useEffect(() => {
    getProfile();
  }, []);

  const cities = [
    { name: "Roma", lat: 41.9028, lon: 12.4964 },
    { name: "Milano", lat: 45.4642, lon: 9.19 },
    { name: "Napoli", lat: 40.8518, lon: 14.2681 },
    { name: "Torino", lat: 45.0703, lon: 7.6869 }
  ];

  const getWeatherUrl = (lat, lon) =>
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&humidity_2m=true&windspeed_10m=true&timezone=auto`;

  return (
    <div className="container">
      <h1>🌍 Meteo Italia</h1>

      {/* 🔹 Campo di ricerca spostato in alto */}
      <div className="search-container">
        <input
          type="text"
          placeholder="🔎 Cerca una città..."
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />
        <button
          onClick={() => {
            fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchCity}&count=1`)
              .then((res) => res.json())
              .then((data) => {
                if (data.results) {
                  const city = data.results[0];
                  setCustomCity({ name: city.name, lat: city.latitude, lon: city.longitude });
                }
              });
          }}
        >
          Cerca
        </button>
      </div>

      {customCity && (
        <div className="search-results">
          <h2>Risultati per {customCity.name}</h2>
          <WeatherData city={customCity} />
        </div>
      )}

      {/* 🔹 Meteo città principali */}
      <div className="weather-cards">
        {cities.map((city) => {
          const { data } = useSWR(getWeatherUrl(city.lat, city.lon), fetcher);
          return data ? (
            <div key={city.name} className="weather-card">
              <h3>{city.name}</h3>
              <p>🌡️ Temperatura: {data.current_weather.temperature}°C</p>
              <p>💧 Umidità: {data.current_weather.relative_humidity}%</p>
              <p>🌬️ Vento: {data.current_weather.windspeed} km/h</p>
              <p>⏰ Ultimo aggiornamento: {new Date(data.current_weather.time).toLocaleTimeString()}</p>
              <p>🌦️ Condizione: {getWeatherDescription(data.current_weather.weathercode)}</p>
            </div>
          ) : (
            <p key={city.name}>Caricamento...</p>
          );
        })}
      </div>
    </div>
  );
}

// 🔹 Descrizione condizioni meteo
const getWeatherDescription = (code) => {
  const weatherConditions = {
    0: "Sereno",
    1: "Prevalentemente sereno",
    2: "Parzialmente nuvoloso",
    3: "Coperto",
    45: "Nebbia",
    48: "Nebbia con brina",
    51: "Pioviggine leggera",
    53: "Pioviggine moderata",
    55: "Pioviggine intensa",
    61: "Pioggia leggera",
    63: "Pioggia moderata",
    65: "Pioggia intensa",
    80: "Rovesci leggeri",
    81: "Rovesci moderati",
    82: "Rovesci forti"
  };
  return weatherConditions[code] || "Condizione sconosciuta";
};

const WeatherData = ({ city }) => {
  const { data } = useSWR(
    `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&humidity_2m=true&windspeed_10m=true&timezone=auto`,
    fetcher
  );

  return data ? (
    <div className="weather-card">
      <h3>{city.name}</h3>
      <p>🌡️ Temperatura: {data.current_weather.temperature}°C</p>
      <p>💧 Umidità: {data.current_weather.relative_humidity}%</p>
      <p>🌬️ Vento: {data.current_weather.windspeed} km/h</p>
      <p>⏰ Ultimo aggiornamento: {new Date(data.current_weather.time).toLocaleTimeString()}</p>
      <p>🌦️ Condizione: {getWeatherDescription(data.current_weather.weathercode)}</p>
    </div>
  ) : (
    <p>Caricamento...</p>
  );
};
