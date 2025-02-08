const apiKey = '2d317c2b95583b8d774f26d3730db4a8';

        // Weather search button functionality
        document.getElementById('searchButton').addEventListener('click', () => {
            const city = document.getElementById('cityInput').value;
            fetchCurrentWeather(city);
            fetchWeatherForecast(city);
        });

        async function fetchCurrentWeather(city) {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

            try {
                const response = await fetch(url);
                const result = await response.json();

                const weatherDiv = document.getElementById('weather');
                weatherDiv.innerHTML = `
                    <p>City: ${result.name}</p>
                    <p>Temperature: ${result.main.temp}°C</p>
                    <p>Feels Like: ${result.main.feels_like}°C</p>
                    <p>Humidity: ${result.main.humidity}%</p>
                    <p>Wind Speed: ${result.wind.speed} m/s</p>
                `;
            } catch (error) {
                console.error(error);
                const weatherDiv = document.getElementById('weather');
                weatherDiv.innerText = 'Error fetching current weather data';
            }
        }

        async function fetchWeatherForecast(city) {
            const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

            try {
                const response = await fetch(url);
                const result = await response.json();

                const forecast = result.list.filter((item, index) => index % 8 === 0).slice(0, 5);
                forecast.forEach((dayWeather, i) => {
                    const dayDiv = document.getElementById(`day${i + 1}`);
                    const date = new Date(dayWeather.dt * 1000).toLocaleDateString();
                    dayDiv.innerHTML = `
                        <p>${date}</p>
                        <p>Temperature: ${dayWeather.main.temp}°C</p>
                        <p>Feels Like: ${dayWeather.main.feels_like}°C</p>
                        <p>Humidity: ${dayWeather.main.humidity}%</p>
                        <p>Wind Speed: ${dayWeather.wind.speed} m/s</p>
                    `;
                });
            } catch (error) {
                console.error(error);
                for (let i = 0; i < 5; i++) {
                    const dayDiv = document.getElementById(`day${i + 1}`);
                    dayDiv.innerText = 'Error fetching forecast data';
                }
            }
        }

        // Air pollution search button functionality
    // Air pollution search button functionality
document.getElementById('searchButtontwo').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    if (city) {
        getCityCoordinates(city);
    } else {
        alert("Please enter a city name!");
    }
});

async function getCityCoordinates(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
        console.log("Fetching city coordinates...");

        const response = await fetch(url);

        // Check if response is successful (status 200)
        if (!response.ok) {
            throw new Error(`City not found. Status code: ${response.status}`);
        }

        const result = await response.json();
        console.log(result); // Log the result for debugging

        const { lat, lon } = result.coord;
        fetchAirPollution(lat, lon);
    } catch (error) {
        console.error("Error in getCityCoordinates:", error);
        const pollutionDiv = document.getElementById('pollution-data');
        pollutionDiv.innerText = `Error fetching city coordinates: ${error.message}`;
    }
}

async function fetchAirPollution(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    try {
        console.log("Fetching air pollution data...");

        const response = await fetch(url);

        // Check if response is successful (status 200)
        if (!response.ok) {
            throw new Error(`Error fetching air pollution data. Status code: ${response.status}`);
        }

        const result = await response.json();
        console.log(result); // Log the result for debugging

        const { list } = result;
        const pollutionData = list[0];

        const pollutionDiv = document.getElementById('pollution-data');
        const aqi = pollutionData.main.aqi;
        const aqiDescription = getAqiDescription(aqi);
        
        pollutionDiv.innerHTML = `
            <p>AQI: ${aqi} (${aqiDescription})</p>
            <p>CO: ${pollutionData.components.co} μg/m³</p>
            <p>NO: ${pollutionData.components.no} μg/m³</p>
            <p>NO2: ${pollutionData.components.no2} μg/m³</p>
            <p>O3: ${pollutionData.components.o3} μg/m³</p>
            <p>SO2: ${pollutionData.components.so2} μg/m³</p>
            <p>PM2.5: ${pollutionData.components.pm2_5} μg/m³</p>
            <p>PM10: ${pollutionData.components.pm10} μg/m³</p>
            <p>NH3: ${pollutionData.components.nh3} μg/m³</p>
        `;
        
        displayAqiChart(aqi);
    } catch (error) {
        console.error("Error in fetchAirPollution:", error);
        const pollutionDiv = document.getElementById('pollution-data');
        pollutionDiv.innerText = `Error fetching air pollution data: ${error.message}`;
    }
}

function getAqiDescription(aqi) {
    switch (aqi) {
        case 1: return 'Good';
        case 2: return 'Fair';
        case 3: return 'Moderate';
        case 4: return 'Poor';
        case 5: return 'Very Poor';
        default: return 'Unknown';
    }
}

function displayAqiChart(aqi) {
    const ctx = document.getElementById('aqiChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['AQI'],
            datasets: [{
                label: 'Air Quality Index',
                data: [aqi],
                backgroundColor: aqi <= 2 ? 'green' : aqi <= 3 ? 'orange' : 'red',
                borderColor: 'black',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5
                }
            }
        }
    });
}