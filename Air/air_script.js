const apiKey = '2d317c2b95583b8d774f26d3730db4a8';

document.getElementById('searchButton').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    getCityCoordinates(city);
});

async function getCityCoordinates(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const result = await response.json();
        const { lat, lon } = result.coord;
        fetchAirPollution(lat, lon);
    } catch (error) {
        console.error(error);
        const pollutionDiv = document.getElementById('pollution-data');
        pollutionDiv.innerText = 'Error fetching city coordinates';
    }
}

async function fetchAirPollution(lat, lon) {
    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const result = await response.json();
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

        // Create the AQI chart
        createAqiChart(aqi);
    } catch (error) {
        console.error(error);
        const pollutionDiv = document.getElementById('pollution-data');
        pollutionDiv.innerText = 'Error fetching air pollution data';
    }
}

function getAqiDescription(aqi) {
    if (aqi === 1) return 'Good';
    if (aqi === 2) return 'Fair';
    if (aqi === 3) return 'Moderate';
    if (aqi === 4) return 'Poor';
    if (aqi === 5) return 'Very Poor';
    return 'Unknown';
}

function createAqiChart(currentAqi) {
    const ctx = document.getElementById('aqiChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'],
            datasets: [{
                label: 'Current AQI',
                data: [1, 2, 3, 4, 5].map(aqi => aqi === currentAqi ? currentAqi : 0),
                backgroundColor: [
                    'rgba(0, 255, 0, 0.6)',
                    'rgba(255, 255, 0, 0.6)',
                    'rgba(255, 165, 0, 0.6)',
                    'rgba(255, 0, 0, 0.6)',
                    'rgba(128, 0, 128, 0.6)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        max: 5,
                        callback: value => ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'][value - 1]
                    }
                }
            }
        }
    });
}
